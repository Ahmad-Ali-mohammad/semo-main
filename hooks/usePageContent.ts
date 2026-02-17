import { useEffect, useState } from 'react';
import { PageContent } from '../types';
import { api } from '../services/api';

interface UsePageContentResult {
  pageContent: PageContent;
  loading: boolean;
}

export function usePageContent(slug: string, fallback: PageContent): UsePageContentResult {
  const [pageContent, setPageContent] = useState<PageContent>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const row = await api.getPageContentBySlug(slug);
        if (!cancelled) setPageContent(row);
      } catch {
        if (!cancelled) setPageContent(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, fallback]);

  return { pageContent, loading };
}
