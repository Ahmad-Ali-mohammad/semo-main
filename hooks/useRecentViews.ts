
import { useState, useEffect } from 'react';
import { Reptile } from '../types';
import { useDatabase } from '../contexts/DatabaseContext';

const RECENT_VIEWS_KEY = 'recent_views';
const MAX_RECENT = 4;

export const useRecentViews = () => {
  const { products } = useDatabase();
  const [recentIds, setRecentIds] = useState<number[]>(() => {
    const saved = sessionStorage.getItem(RECENT_VIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const addView = (id: number) => {
    setRecentIds(prev => {
      const filtered = prev.filter(viewId => viewId !== id);
      const updated = [id, ...filtered].slice(0, MAX_RECENT);
      sessionStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const recentProducts = recentIds
    .map(id => products.find(r => r.id === id))
    .filter((r): r is Reptile => r !== undefined);

  return { recentProducts, addView };
};
