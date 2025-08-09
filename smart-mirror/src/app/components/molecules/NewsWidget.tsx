// src/app/components/molecules/NewsWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { NewsArticle } from '@/app/types';

interface NewsWidgetProps {
  category?: string;
  maxArticles?: number;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ 
  category = 'technology', 
  maxArticles = 5 
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news?category=${category}`);
        const data = await response.json();
        setArticles(data.articles.slice(0, maxArticles));
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 1800000); // Update every 30 minutes

    return () => clearInterval(interval);
  }, [category, maxArticles]);

  useEffect(() => {
    if (articles.length > 0) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }, 10000); // Rotate every 10 seconds

      return () => clearInterval(rotationInterval);
    }
  }, [articles]);

  if (loading) {
    return <div className="text-white">Loading news...</div>;
  }

  if (articles.length === 0) {
    return <div className="text-red-400">No news available</div>;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Latest News</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm line-clamp-2">
            {currentArticle.title}
          </h4>
          <p className="text-gray-300 text-xs mt-1 line-clamp-3">
            {currentArticle.description}
          </p>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>{currentArticle.source}</span>
            <span>{new Date(currentArticle.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex space-x-1">
          {articles.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded ${
                index === currentIndex ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsWidget;