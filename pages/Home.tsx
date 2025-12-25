import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPosts } from '../services/storageService';
import { ArrowRight, Calendar, Search } from 'lucide-react';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-20">
      <header className="text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight">
          The Journal
        </h1>
        <p className="text-stone font-handwriting text-2xl md:text-3xl">
          Thoughts, moments, and quiet reflections.
        </p>
      </header>

      {/* Search Section */}
      <div className="max-w-md mx-auto relative group mb-16">
        <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-stone/40 group-focus-within:text-gold transition-colors duration-300" />
        </div>
        <input
          type="text"
          className="block w-full pl-8 pr-4 py-2 border-b border-stone/20 bg-transparent text-charcoal placeholder-stone/40 focus:outline-none focus:border-gold transition-colors font-serif text-lg tracking-wide"
          placeholder="Search by title, category, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-16 min-h-[300px]">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start animate-fade-in">
              <div className="w-full md:w-1/3 aspect-[4/5] overflow-hidden rounded-sm bg-gray-100">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-xs text-stone tracking-widest uppercase font-sans">
                  {post.category && (
                    <>
                      <span className="text-gold font-bold">{post.category}</span>
                      <span className="w-px h-3 bg-stone/40"></span>
                    </>
                  )}
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <h2 className="text-3xl font-serif text-charcoal group-hover:text-gold transition-colors duration-300">
                  <Link to={`/article/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-stone/80 font-serif leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                   {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider text-stone/60 border border-stone/20 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                   ))}
                </div>
                {post.content.length > post.excerpt.length && (
                  <div className="pt-2">
                    <Link 
                      to={`/article/${post.id}`}
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-all"
                    >
                      Read Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-stone italic text-lg">
              No stories found matching "{searchQuery}"
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-xs uppercase tracking-widest text-charcoal border-b border-charcoal hover:text-gold hover:border-gold transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};