import { useEffect, useMemo, useState } from 'react';
import { SeoSettings } from '../types';
import { api } from '../services/api';

const defaultSeoSettings: SeoSettings = {
  siteName: 'Reptile House',
  defaultTitle: 'بيت الزواحف | متجر الزواحف والمستلزمات',
  titleSeparator: '|',
  defaultDescription: 'متجر متخصص بالزواحف والمستلزمات مع محتوى تعليمي ودعم احترافي.',
  defaultKeywords: 'زواحف, متجر زواحف, مستلزمات زواحف, ثعابين, سحالي, بيت الزواحف',
  canonicalBaseUrl: 'http://localhost:5173',
  defaultOgImage: '/assets/photo_2026-02-04_07-13-35.jpg',
  twitterHandle: '',
  robotsIndex: true,
  robotsFollow: true,
  googleVerification: '',
  bingVerification: '',
  yandexVerification: '',
  locale: 'ar_SY',
  themeColor: '#0f172a',
  organizationName: 'Reptile House',
  organizationLogo: '/assets/photo_2026-02-04_07-13-35.jpg',
  organizationDescription: 'متجر متخصص بالزواحف والمستلزمات مع محتوى تعليمي ودعم احترافي.',
  sitemapEnabled: true,
  excludedPaths: '/dashboard',
  customRobotsTxt: '',
};

function setMetaByName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

function setStructuredData(settings: SeoSettings) {
  const id = 'seo-organization-jsonld';
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.organizationName || settings.siteName,
    url: settings.canonicalBaseUrl,
    logo: settings.organizationLogo || settings.defaultOgImage,
    description: settings.organizationDescription || settings.defaultDescription,
  });
}

function buildPageMeta(currentPage: string, settings: SeoSettings) {
  const mapping: Record<string, { title: string; description: string }> = {
    home: { title: 'الصفحة الرئيسية', description: settings.defaultDescription },
    showcase: { title: 'المعرض', description: 'تصفح جميع الزواحف المتاحة في المتجر.' },
    supplies: { title: 'المستلزمات', description: 'كل مستلزمات الزواحف من تغذية وسكن وتدفئة.' },
    services: { title: 'الخدمات', description: 'خدمات الرعاية والدعم والإرشاد لمربي الزواحف.' },
    offers: { title: 'العروض', description: 'أحدث العروض والباقات الخاصة بمتجر بيت الزواحف.' },
    blog: { title: 'المدونة', description: 'مقالات تعليمية ونصائح طبية حول تربية الزواحف.' },
    about: { title: 'من نحن', description: 'تعرف على فريق وخبرة بيت الزواحف.' },
    contact: { title: 'اتصل بنا', description: 'تواصل معنا للاستفسارات والطلبات.' },
    privacy: { title: 'سياسة الخصوصية', description: 'سياسة الخصوصية الخاصة بموقع بيت الزواحف.' },
    terms: { title: 'الشروط والأحكام', description: 'الشروط والأحكام المنظمة لاستخدام الموقع.' },
    returnPolicy: { title: 'سياسة الإرجاع', description: 'سياسة الإرجاع والاستبدال في المتجر.' },
    shippingPolicy: { title: 'سياسة الشحن', description: 'تفاصيل الشحن والتوصيل ومواعيد التسليم.' },
    warranty: { title: 'الضمان والصحة', description: 'سياسة الضمان الصحي وتعليمات السلامة.' },
  };

  if (currentPage.startsWith('product/')) {
    return { title: 'تفاصيل المنتج', description: 'تفاصيل منتج الزواحف والمواصفات والعناية.' };
  }
  if (currentPage.startsWith('article/')) {
    return { title: 'تفاصيل المقال', description: 'اقرأ المقال التعليمي من مدونة بيت الزواحف.' };
  }
  return mapping[currentPage] || { title: settings.defaultTitle, description: settings.defaultDescription };
}

export function useSeoManager(currentPage: string, appMode: 'user' | 'dashboard') {
  const [settings, setSettings] = useState<SeoSettings>(defaultSeoSettings);

  useEffect(() => {
    let isCancelled = false;
    const loadSeo = async () => {
      try {
        const loaded = await api.getSeoSettings();
        if (!isCancelled) setSettings({ ...defaultSeoSettings, ...loaded });
      } catch {
        if (!isCancelled) setSettings(defaultSeoSettings);
      }
    };
    loadSeo();
    return () => {
      isCancelled = true;
    };
  }, []);

  const pageMeta = useMemo(() => buildPageMeta(currentPage, settings), [currentPage, settings]);

  useEffect(() => {
    const separator = settings.titleSeparator || '|';
    const fullTitle = appMode === 'dashboard'
      ? `لوحة الإدارة ${separator} ${settings.siteName}`
      : `${pageMeta.title} ${separator} ${settings.siteName}`;
    const description = appMode === 'dashboard'
      ? 'لوحة إدارة متجر بيت الزواحف.'
      : pageMeta.description || settings.defaultDescription;
    const robots = appMode === 'dashboard'
      ? 'noindex, nofollow'
      : `${settings.robotsIndex ? 'index' : 'noindex'}, ${settings.robotsFollow ? 'follow' : 'nofollow'}`;
    const pagePath = currentPage.startsWith('dashboard') ? '/dashboard' : `/${currentPage === 'home' ? '' : currentPage}`;
    const canonicalBase = (settings.canonicalBaseUrl || defaultSeoSettings.canonicalBaseUrl).replace(/\/$/, '');
    const canonicalUrl = `${canonicalBase}${pagePath}`;
    const image = settings.defaultOgImage || defaultSeoSettings.defaultOgImage;

    document.title = fullTitle;
    setMetaByName('description', description);
    setMetaByName('keywords', settings.defaultKeywords || defaultSeoSettings.defaultKeywords);
    setMetaByName('robots', robots);
    setMetaByName('theme-color', settings.themeColor || defaultSeoSettings.themeColor);

    if (settings.googleVerification) setMetaByName('google-site-verification', settings.googleVerification);
    if (settings.bingVerification) setMetaByName('msvalidate.01', settings.bingVerification);
    if (settings.yandexVerification) setMetaByName('yandex-verification', settings.yandexVerification);

    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:image', image);
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:site_name', settings.siteName);
    setMetaByProperty('og:locale', settings.locale || 'ar_SY');

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', image);
    if (settings.twitterHandle) setMetaByName('twitter:site', settings.twitterHandle);

    setCanonical(canonicalUrl);
    setStructuredData(settings);
  }, [appMode, currentPage, pageMeta, settings]);
}
