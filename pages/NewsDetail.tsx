
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { api } from '../services/dataService';
import AdsPlaceholder from '../components/AdsPlaceholder';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (id) {
        const data = await api.getNewsById(id);
        setNews(data || null);
      }
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!news) return <div className="flex justify-center items-center h-screen">News not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
       <Link to="/" className="inline-flex items-center text-slate-500 hover:text-accent mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-64 sm:h-80 w-full overflow-hidden relative">
            {news.imageUrl ? (
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                    No Image Available
                </div>
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white">
                <span className="bg-accent px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                    {news.source}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold leading-tight max-w-2xl text-shadow-sm">
                    {news.title}
                </h1>
            </div>
        </div>

        <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {news.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{news.author}</p>
                        <p className="text-xs text-slate-500">Market Analyst</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Published</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(news.publishedAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                    {news.description}
                </p>
                <div className="text-slate-700 leading-7 space-y-4">
                    {/* Simulating paragraphs from the 'content' string */}
                    <p>{news.content}</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>

            <AdsPlaceholder />
            
            <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                    {['Markets', 'Economy', 'Commodities', 'Global Trade', 'Forecasting'].map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
