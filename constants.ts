
import { StyleSeries } from './types';

export const STYLES: StyleSeries[] = [
  { id: 'minimalist', name: 'Minimalist', colorClass: 'from-white to-gray-200', description: 'Clean, simple, elegant' },
  { id: 'floral', name: 'Floral', colorClass: 'from-pink-100 to-rose-200', description: 'Romantic and delicate' },
  { id: 'cyberpunk', name: 'Cyberpunk', colorClass: 'from-blue-900 to-indigo-900', description: 'Neon and futuristic' },
  { id: 'vintage', name: 'Vintage', colorClass: 'from-amber-100 to-orange-200', description: 'Classic and nostalgic' },
  { id: 'ethereal', name: 'Ethereal', colorClass: 'from-purple-200 to-indigo-300', description: 'Dreamy and magical' },
];

export const EVENT_TYPES = ['Wedding Ceremony', 'Birthday Party', 'Corporate Event', 'Tech Conference', 'Art Gallery Opening'];

export const TRENDING_COLLECTIONS = [
  {
    id: 1,
    title: 'Ethereal Wedding',
    subtitle: 'Series 01 • Classic Elegance',
    badge: 'Most Popular',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Cyberpunk Party',
    subtitle: 'Series 02 • Modern Vibes',
    badge: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1547891301-157dc311f5d3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Minimalist Corporate',
    subtitle: 'Series 03 • Sophisticated',
    badge: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800',
  }
];
