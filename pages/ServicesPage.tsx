import React, { useEffect, useState } from 'react';
import PageNotAvailable from '../components/PageNotAvailable';
import { usePageContent } from '../hooks/usePageContent';
import { api } from '../services/api';
import { PageContent, ServiceItem } from '../types';

const servicesFallback: PageContent = {
  id: 'fallback-services',
  slug: 'services',
  title: 'خدماتنا الاحترافية',
  excerpt: '',
  content: '',
  seoTitle: 'الخدمات - Reptile House',
  seoDescription: '',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const formatServicePrice = (price?: number) => {
  if (price == null) {
    return 'السعر يحدد حسب نوع الخدمة';
  }

  if (price === 0) {
    return 'استشارة أولية مجانية';
  }

  return `${price} ل.س`;
};

const ServicesPage: React.FC = () => {
  const { pageContent, isActive } = usePageContent('services', servicesFallback);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      setLoading(true);
      try {
        const rows = await api.getServices(true);
        if (!cancelled) {
          setServices(Array.isArray(rows) ? rows : []);
        }
      } catch (error) {
        console.error('Failed to load published services:', error);
        if (!cancelled) {
          setServices([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isActive) {
    return <PageNotAvailable title={pageContent.title || 'صفحة الخدمات غير متاحة حاليًا'} />;
  }

  return (
    <div className="space-y-10 animate-fade-in text-right">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="mb-5 text-4xl font-black md:text-6xl">
          {pageContent.title || 'خدماتنا الاحترافية'}
        </h1>

        {pageContent.excerpt && (
          <p className="text-lg leading-relaxed text-gray-300">{pageContent.excerpt}</p>
        )}

        {pageContent.content?.trim() && (
          <div
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-right leading-loose text-gray-300"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        )}
      </section>

      {loading ? (
        <div className="py-20 text-center font-bold text-gray-400">جاري تحميل الخدمات...</div>
      ) : services.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 py-20 text-center font-bold text-gray-400 glass-medium">
          لا توجد خدمات منشورة حاليًا. عد لاحقًا أو تواصل معنا للحصول على خدمة مخصصة.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-[2rem] border border-white/10 p-8 transition-all hover:border-amber-500/40 glass-medium"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black">{service.title}</h2>
                  <p className="font-black text-amber-400">{formatServicePrice(service.price)}</p>
                </div>
                <div className="text-4xl">{service.icon || '🦎'}</div>
              </div>

              {service.imageUrl && (
                <div className="mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {service.description && <p className="leading-loose text-gray-300">{service.description}</p>}

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <span className="text-xs font-black uppercase tracking-[0.35em] text-amber-500/80">
                  خدمة منشورة من لوحة الإدارة
                </span>
                <span className="text-sm text-gray-400">الترتيب #{service.sortOrder}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
