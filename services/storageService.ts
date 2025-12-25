import { BlogPost, Photo } from '../types';

const POSTS_KEY = 'serene_blog_posts';
const PHOTOS_KEY = 'serene_blog_photos';

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Slow Living',
    excerpt: 'Rediscovering the beauty of taking things one step at a time in a chaotic world.',
    content: `In a world that constantly demands our attention, finding silence is an act of rebellion. 

> "Nature does not hurry, yet everything is accomplished." - Lao Tzu

Yesterday, I took a walk through the autumn woods. The leaves were turning that crisp, burnt orange color that only exists for a few weeks a year. It reminded me that transitions are beautiful, even when they signify an ending.

We often rush through our days, ticking off boxes, forgetting to actually *live* them. What if we just stopped? Just for a moment. To breathe. To listen. To be.

The coffee tasted better this morning. The sunlight hitting my desk felt warmer. It's the little things that anchor us.`,
    coverImage: 'https://picsum.photos/800/600?random=1',
    date: '2023-10-15',
    tags: ['Mindfulness'],
    category: 'Lifestyle'
  },
  {
    id: '2',
    title: 'Minimalist Interior Trends',
    excerpt: 'How to declutter your space and your mind with simple design principles.',
    content: `Minimalism isn't just about having less stuff; it's about making room for more of what matters. 

I recently cleared out my study. Three boxes of old papers, broken pens, and books I'll never read again. The physical space cleared, and suddenly, my mental space followed suit.

> Less is more.

Try it this weekend. Pick one corner. Just one. Clear it. See how you feel.`,
    coverImage: 'https://picsum.photos/800/600?random=2',
    date: '2023-11-02',
    tags: ['Interior'],
    category: 'Design'
  }
];

const INITIAL_PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/400/600?random=10', caption: 'Morning light' },
  { id: '2', url: 'https://picsum.photos/400/400?random=11', caption: 'Coffee breaks' },
  { id: '3', url: 'https://picsum.photos/400/500?random=12', caption: 'City shadows' },
  { id: '4', url: 'https://picsum.photos/400/300?random=13', caption: 'Mountain view' },
  { id: '5', url: 'https://picsum.photos/400/600?random=14', caption: 'Reading corner' },
  { id: '6', url: 'https://picsum.photos/400/400?random=15', caption: 'Textures' },
];

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  if (!stored) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  const parsed = JSON.parse(stored);
  // Migration for older posts without category
  return parsed.map((p: any) => ({
    ...p,
    category: p.category || 'General'
  }));
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const getPhotos = (): Photo[] => {
  const stored = localStorage.getItem(PHOTOS_KEY);
  if (!stored) {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(INITIAL_PHOTOS));
    return INITIAL_PHOTOS;
  }
  return JSON.parse(stored);
};

export const savePhoto = (photo: Photo): void => {
  const photos = getPhotos();
  photos.unshift(photo);
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
};