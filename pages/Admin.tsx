import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { getPosts, savePost, deletePost } from '../services/storageService';
import { generateBlogContent } from '../services/geminiService';
import { Plus, Trash2, Save, Sparkles, Loader2, Upload, X, Eye, Clock } from 'lucide-react';

export const Admin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  
  // Tag State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(getPosts());
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setCategory(post.category);
    setTags(post.tags);
    setTagInput('');
  };

  const handleNew = () => {
    setEditingId('new');
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage(`https://picsum.photos/800/600?random=${Date.now()}`);
    setCategory('');
    setTags([]);
    setTagInput('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCoverImage = coverImage.trim() || `https://picsum.photos/800/600?random=${Date.now()}`;
    const finalCategory = category.trim() || 'General';

    // Include any pending tag in the input field
    let finalTags = [...tags];
    if (tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!finalTags.includes(newTag)) {
        finalTags.push(newTag);
      }
    }

    const newPost: BlogPost = {
      id: editingId === 'new' ? Date.now().toString() : editingId!,
      title,
      excerpt,
      content,
      coverImage: finalCoverImage,
      date: new Date().toISOString().split('T')[0],
      category: finalCategory,
      tags: finalTags
    };

    savePost(newPost);
    setEditingId(null);
    setTagInput('');
    loadPosts();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadPosts();
      if (editingId === id) setEditingId(null);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const generatedText = await generateBlogContent(aiPrompt);
      setContent(prev => prev + (prev ? '\n\n' : '') + generatedText);
      if (!title) setTitle(`Reflections on ${aiPrompt}`);
      if (!excerpt) setExcerpt(`A short exploration of ${aiPrompt}...`);
    } catch (err) {
      alert('Failed to generate content. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag Handlers
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Rendering Helper for Preview (similar to Article.tsx)
  const renderPreviewContent = (text: string) => {
    return text.split('\n\n').map((block, index) => {
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

  // Unique categories for autocomplete
  const existingCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Content Management</h1>
          <p className="text-stone">Manage your stories and gallery.</p>
        </div>
        <button 
          onClick={handleNew}
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-sm hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" /> New Story
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar List */}
        <div className="bg-white p-6 rounded-sm shadow-sm space-y-4 lg:col-span-1 h-fit">
          <h2 className="font-bold text-sm uppercase tracking-widest text-stone mb-4">All Posts ({posts.length})</h2>
          <div className="space-y-2">
            {posts.map(post => (
              <div 
                key={post.id} 
                className={`p-3 rounded-sm cursor-pointer border hover:border-gold transition-all ${editingId === post.id ? 'border-gold bg-cream' : 'border-transparent'}`}
                onClick={() => handleEdit(post)}
              >
                <h3 className="font-serif font-medium truncate">{post.title}</h3>
                <div className="flex justify-between items-center mt-1">
                   <p className="text-xs text-stone">{post.date}</p>
                   {post.category && <span className="text-[10px] uppercase tracking-wider text-gold">{post.category}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white p-8 rounded-sm shadow-sm min-h-[500px]">
          {editingId ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone/10">
                <h2 className="font-serif text-xl">{editingId === 'new' ? 'Create New Post' : 'Edit Post'}</h2>
                <div className="flex gap-2">
                   {editingId !== 'new' && (
                     <button type="button" onClick={() => handleDelete(editingId)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                       <Trash2 className="w-5 h-5" />
                     </button>
                   )}
                   <button 
                     type="button" 
                     onClick={() => setShowPreview(true)}
                     className="flex items-center gap-2 bg-stone/10 text-charcoal px-4 py-2 rounded-sm hover:bg-stone/20 transition-colors"
                   >
                      <Eye className="w-4 h-4" /> Preview
                   </button>
                   <button type="submit" className="flex items-center gap-2 bg-gold text-white px-6 py-2 rounded-sm hover:bg-yellow-600 transition-colors">
                     <Save className="w-4 h-4" /> Save
                   </button>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-cream p-4 rounded-sm border border-stone/10">
                <label className="text-xs uppercase tracking-widest font-bold text-gold flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3" /> AI Assistant
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Topic (e.g., 'Walking in the rain')" 
                    className="flex-1 bg-white border border-stone/20 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt}
                    className="bg-stone/10 text-charcoal px-4 py-2 text-sm hover:bg-stone/20 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Draft'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone mb-2">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-2xl font-serif border-b border-stone/20 py-2 focus:outline-none focus:border-charcoal bg-transparent"
                  placeholder="Enter title..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone mb-2">Excerpt</label>
                <textarea 
                  value={excerpt} 
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full h-20 text-sm border border-stone/20 p-3 focus:outline-none focus:border-charcoal bg-transparent"
                  placeholder="A short summary..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone mb-2">Content (Markdown supported)</label>
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-64 text-base font-serif border border-stone/20 p-4 focus:outline-none focus:border-charcoal bg-transparent leading-relaxed"
                  placeholder="Start writing..."
                  required
                />
                <p className="text-xs text-stone mt-1">Tip: Start a paragraph with &gt; for a blockquote.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs uppercase tracking-widest text-stone mb-2">Cover Image URL</label>
                   <div className="flex gap-2 items-end">
                     <input 
                        type="text" 
                        value={coverImage} 
                        onChange={e => setCoverImage(e.target.value)}
                        className="flex-1 border-b border-stone/20 py-2 focus:outline-none focus:border-charcoal bg-transparent text-sm truncate"
                        placeholder="https://..."
                     />
                     <label className="cursor-pointer text-stone hover:text-gold transition-colors p-2" title="Upload Image">
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleImageUpload}
                       />
                       <Upload className="w-5 h-5" />
                     </label>
                   </div>
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone mb-2">Category</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    list="category-suggestions"
                    className="w-full border-b border-stone/20 py-2 focus:outline-none focus:border-charcoal bg-transparent text-sm"
                    placeholder="Select or type..."
                  />
                  <datalist id="category-suggestions">
                    {existingCategories.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              {/* Visual Tag Editor */}
              <div>
                 <label className="block text-xs uppercase tracking-widest text-stone mb-2">Tags</label>
                 <div className="flex flex-wrap items-center gap-2 border-b border-stone/20 py-2 focus-within:border-charcoal transition-colors min-h-[40px]">
                   {tags.map(tag => (
                     <span key={tag} className="bg-paper text-charcoal px-2 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1 font-sans border border-stone/10">
                       #{tag}
                       <button type="button" onClick={() => removeTag(tag)} className="text-stone hover:text-red-500 focus:outline-none">
                         <X className="w-3 h-3" />
                       </button>
                     </span>
                   ))}
                   <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 bg-transparent focus:outline-none text-sm min-w-[80px] placeholder-stone/30"
                      placeholder={tags.length === 0 ? "Type & Enter..." : ""}
                   />
                 </div>
                 <p className="text-[10px] text-stone mt-1">Press Enter or comma to add a tag</p>
              </div>

            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-stone">
              <p>Select a post to edit or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] bg-cream overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-12 sticky top-0 bg-cream/95 backdrop-blur-sm py-4 border-b border-stone/10">
                <div className="flex items-center gap-2">
                   <Eye className="w-4 h-4 text-gold" />
                   <p className="text-gold uppercase tracking-widest text-xs font-bold">Preview Mode</p>
                </div>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="flex items-center gap-2 text-stone hover:text-charcoal uppercase tracking-widest text-xs border border-stone/20 px-3 py-1 rounded-full hover:border-charcoal transition-colors"
                >
                    <X className="w-4 h-4" /> Close Preview
                </button>
            </div>

            <div className="animate-fade-in">
                <header className="text-center space-y-6 mb-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-stone tracking-widest uppercase">
                    {category && (
                        <>
                        <span className="text-gold font-bold">{category}</span>
                        <span className="w-1 h-1 rounded-full bg-stone"></span>
                        </>
                    )}
                    <span>{new Date().toISOString().split('T')[0]}</span>
                    <span className="w-1 h-1 rounded-full bg-stone"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
                    {title || "Untitled Post"}
                    </h1>
                    <div className="flex justify-center gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-paper text-stone text-xs rounded-full">
                        #{tag}
                        </span>
                    ))}
                    </div>
                </header>

                <div className="w-full aspect-video mb-12 overflow-hidden rounded-sm shadow-sm bg-stone/10">
                    <img 
                    src={coverImage || 'https://via.placeholder.com/800x600'} 
                    alt="Preview cover" 
                    className="w-full h-full object-cover"
                    />
                </div>

                <div className="prose prose-stone prose-lg max-w-none font-serif">
                    {renderPreviewContent(content || "Start writing to see content here...")}
                </div>

                <hr className="my-12 border-stone/20" />

                <div className="text-center">
                    <p className="font-handwriting text-2xl mb-4">Thanks for reading</p>
                    <div className="w-16 h-px bg-charcoal mx-auto"></div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};