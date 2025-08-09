// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'technology';
  const country = searchParams.get('country') || 'us';

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}&pageSize=10`
    );

    if (!response.ok) {
      throw new Error('News API request failed');
    }

    const data = await response.json();

    const articles = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      urlToImage: article.urlToImage,
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}