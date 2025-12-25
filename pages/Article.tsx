import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPosts } from '../services/storageService';
import { ArrowLeft, Clock } from 'lucide-react';

export const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!post) return null;

  // Simple parser to render blockquotes nicely (mimicking Markdown parser logic roughly for demo)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, index) => {
      if (block.startsWith('>')) {
        return (
          <blockquote key={index} className="my-8 md:my-12 px-6 border-l-2 border-gold/50">
            <p className="text-2xl md:text-4xl font-handwriting text-charcoal/80 leading-relaxed">
              {block.replace('>', '').trim()}
            </p>
          </blockquote>
        );
      }
      return (
        <p key={index} className="mb-6 text-lg font-serif text-charcoal/80 leading-loose">
          {block}
        </p>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-stone hover:text-charcoal mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs">Back to Journal</span>
      </button>

      <header className="text-center space-y-6 mb-12">
        <div className="flex items-center justify-center gap-2 text-xs text-stone tracking-widest uppercase">
          {post.category && (
            <>
              <span className="text-gold font-bold">{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-stone"></span>
            </>
          )}
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-stone"></span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
          {post.title}
        </h1>
        <div className="flex justify-center gap-2">
           {post.tags.map(tag => (
             <span key={tag} className="px-3 py-1 bg-paper text-stone text-xs rounded-full">
               #{tag}
             </span>
           ))}
        </div>
      </header>

      <div className="w-full aspect-video mb-12 overflow-hidden rounded-sm shadow-sm">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-stone prose-lg max-w-none font-serif">
        {renderContent(post.content)}
      </div>

      <hr className="my-12 border-stone/20" />

      <div className="text-center">
        <p className="font-handwriting text-2xl mb-4">Thanks for reading</p>
        <div className="w-16 h-px bg-charcoal mx-auto"></div>
      </div>
    </div>
  );
};