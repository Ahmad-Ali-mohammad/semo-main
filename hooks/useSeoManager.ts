import { useEffect, useMemo, useState } from 'react';
import { SeoSettings } from '../types';
import { api } from '../services/api';

const canonicalFromEnv =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CANONICAL_BASE_URL
    ? String(import.meta.env.VITE_CANONICAL_BASE_URL).trim()
    : '') || '';
const canonicalFromWindow = typeof window !== 'undefined' ? window.location.origin : '';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const defaultCanonicalBaseUrl = normalizeBaseUrl(canonicalFromEnv || canonicalFromWindow || 'https://reptile-house.com');

const defaultSeoSettings: SeoSettings = {
  siteName: 'Reptile House',
  defaultTitle: 'بيت الزواحف | متجر الزواحف والمستلزمات',
  titleSeparator: '|',
  defaultDescription: 'متجر متخصص بالزواحف والمستلزمات مع محتوى تعليمي وخدمات احترافية لعشاق الزواحف.',
  defaultKeywords: 'بيت الزواحف, Reptile House, متجر زواحف, مستلزمات زواحف, ثعابين, سحالي, تيراريوم',
  canonicalBaseUrl: defaultCanonicalBaseUrl,
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
  organizationDescription: 'متجر متخصص بالزواحف والمستلزمات مع محتوى تعليمي وخدمات احترافية.',
  sitemapEnabled: true,
  excludedPaths: '/dashboard',
  customRobotsTxt: '',
};

function valueOrFallback(value: string | undefined | null, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeLoadedSettings(loaded: Partial<SeoSettings> | null | undefined): SeoSettings {
  const merged = { ...defaultSeoSettings, ...(loaded || {}) };

  return {
    ...merged,
    siteName: valueOrFallback(merged.siteName, defaultSeoSettings.siteName),
    defaultTitle: valueOrFallback(merged.defaultTitle, defaultSeoSettings.defaultTitle),
    titleSeparator: valueOrFallback(merged.titleSeparator, defaultSeoSettings.titleSeparator),
    defaultDescription: valueOrFallback(merged.defaultDescription, defaultSeoSettings.defaultDescription),
    defaultKeywords: valueOrFallback(merged.defaultKeywords, defaultSeoSettings.defaultKeywords),
    canonicalBaseUrl: normalizeBaseUrl(valueOrFallback(merged.canonicalBaseUrl, defaultSeoSettings.canonicalBaseUrl)),
    defaultOgImage: valueOrFallback(merged.defaultOgImage, defaultSeoSettings.defaultOgImage),
    locale: valueOrFallback(merged.locale, defaultSeoSettings.locale),
    themeColor: valueOrFallback(merged.themeColor, defaultSeoSettings.themeColor),
    organizationName: valueOrFallback(merged.organizationName, defaultSeoSettings.organizationName),
    organizationLogo: valueOrFallback(merged.organizationLogo, defaultSeoSettings.organizationLogo),
    organizationDescription: valueOrFallback(
      merged.organizationDescription,
      defaultSeoSettings.organizationDescription,
    ),
    robotsIndex: merged.robotsIndex !== false,
    robotsFollow: merged.robotsFollow !== false,
    sitemapEnabled: merged.sitemapEnabled !== false,
    excludedPaths: typeof merged.excludedPaths === 'string' ? merged.excludedPaths : defaultSeoSettings.excludedPaths,
    customRobotsTxt: typeof merged.customRobotsTxt === 'string' ? merged.customRobotsTxt : '',
    twitterHandle: typeof merged.twitterHandle === 'string' ? merged.twitterHandle : '',
    googleVerification: typeof merged.googleVerification === 'string' ? merged.googleVerification : '',
    bingVerification: typeof merged.bingVerification === 'string' ? merged.bingVerification : '',
    yandexVerification: typeof merged.yandexVerification === 'string' ? merged.yandexVerification : '',
  };
}

function joinKeywords(...sources: string[]): string {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const source of sources) {
    for (const token of String(source || '').split(/[,\u060C]/)) {
      const cleaned = token.trim();
      if (!cleaned) continue;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      ordered.push(cleaned);
    }
  }

  return ordered.join(', ');
}

function resolveAbsoluteUrl(baseUrl: string, value: string): string {
  if (!value) return baseUrl;
  try {
    return new URL(value, `${baseUrl}/`).toString();
  } catch {
    return value;
  }
}

function setMetaByName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function removeMetaByName(name: string) {
  document.querySelectorAll(`meta[name="${name}"]`).forEach((meta) => meta.remove());
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

function setAlternateLanguageLink(language: string, href: string) {
  let link = document.querySelector(`link[rel="alternate"][hreflang="${language}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = language;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setStructuredData(settings: SeoSettings, canonicalUrl: string) {
  const id = 'seo-structured-data-jsonld';
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const logoUrl = resolveAbsoluteUrl(settings.canonicalBaseUrl, settings.organizationLogo || settings.defaultOgImage);

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: settings.organizationName || settings.siteName,
        url: settings.canonicalBaseUrl,
        logo: logoUrl,
        description: settings.organizationDescription || settings.defaultDescription,
      },
      {
        '@type': 'WebSite',
        name: settings.siteName,
        url: settings.canonicalBaseUrl,
        inLanguage: settings.locale || 'ar_SY',
      },
      {
        '@type': 'WebPage',
        name: document.title,
        url: canonicalUrl,
        inLanguage: settings.locale || 'ar_SY',
      },
    ],
  });
}

function pageToCanonicalPath(currentPage: string): string {
  if (currentPage.startsWith('product/')) return `/product/${currentPage.split('/')[1] || ''}`;
  if (currentPage.startsWith('article/')) return `/article/${currentPage.split('/')[1] || ''}`;
  if (currentPage.startsWith('orderTracking/')) return `/order-tracking/${currentPage.split('/')[1] || ''}`;
  if (currentPage.startsWith('dashboard/')) return `/dashboard/${currentPage.replace('dashboard/', '')}`;

  const mapping: Record<string, string> = {
    home: '/',
    shippingPolicy: '/shipping-policy',
    returnPolicy: '/return-policy',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    orderConfirmation: '/order-confirmation',
    orderTracking: '/order-tracking',
    dashboard: '/dashboard',
  };

  if (mapping[currentPage]) return mapping[currentPage];
  return `/${currentPage}`;
}

function isNonIndexablePage(appMode: 'user' | 'dashboard', currentPage: string): boolean {
  if (appMode === 'dashboard' || currentPage.startsWith('dashboard')) return true;

  const exactNoIndexPages = new Set([
    'login',
    'register',
    'profile',
    'wishlist',
    'orders',
    'cart',
    'checkout',
    'orderConfirmation',
    'orderTracking',
    'forgotPassword',
    'resetPassword',
  ]);

  if (exactNoIndexPages.has(currentPage)) return true;
  if (currentPage.startsWith('orderTracking/')) return true;
  return false;
}

type PageMeta = {
  title: string;
  description: string;
  keywords: string;
};

function buildPageMeta(currentPage: string, settings: SeoSettings) {
  const baseKeywords = settings.defaultKeywords || defaultSeoSettings.defaultKeywords;
  const mapping: Record<string, PageMeta> = {
    home: {
      title: 'الصفحة الرئيسية',
      description: settings.defaultDescription,
      keywords: joinKeywords(
        baseKeywords,
        'بيت الزواحف',
        'متجر زواحف',
        'زواحف دمشق',
        'شراء زواحف',
        'تربية الزواحف',
      ),
    },
    showcase: {
      title: 'معرض الزواحف',
      description: 'تصفح جميع الزواحف المتاحة في المتجر.',
      keywords: joinKeywords(baseKeywords, 'معرض زواحف', 'زواحف للبيع', 'ثعابين للبيع', 'سحالي للبيع'),
    },
    supplies: {
      title: 'المستلزمات',
      description: 'كل مستلزمات الزواحف من تغذية وسكن وتدفئة.',
      keywords: joinKeywords(
        baseKeywords,
        'مستلزمات الزواحف',
        'معدات تربية الزواحف',
        'تدفئة الزواحف',
        'إضاءة الزواحف',
        'تيراريوم',
      ),
    },
    services: {
      title: 'الخدمات',
      description: 'خدمات الرعاية والدعم والإرشاد لمربي الزواحف.',
      keywords: joinKeywords(baseKeywords, 'خدمات الزواحف', 'استشارات تربية الزواحف', 'رعاية الزواحف'),
    },
    offers: {
      title: 'العروض',
      description: 'أحدث العروض والباقات الخاصة بمتجر بيت الزواحف.',
      keywords: joinKeywords(baseKeywords, 'عروض الزواحف', 'خصومات الزواحف', 'باقات الزواحف'),
    },
    blog: {
      title: 'المدونة',
      description: 'مقالات تعليمية ونصائح عملية حول تربية الزواحف.',
      keywords: joinKeywords(
        baseKeywords,
        'مدونة الزواحف',
        'نصائح تربية الزواحف',
        'تعليم تربية الثعابين',
        'العناية بالسحالي',
      ),
    },
    about: {
      title: 'من نحن',
      description: 'تعرف على فريق وخبرة بيت الزواحف.',
      keywords: joinKeywords(baseKeywords, 'من نحن بيت الزواحف', 'خبراء الزواحف'),
    },
    contact: {
      title: 'اتصل بنا',
      description: 'تواصل معنا للاستفسارات والطلبات.',
      keywords: joinKeywords(baseKeywords, 'التواصل مع متجر الزواحف', 'رقم متجر الزواحف', 'طلب زواحف'),
    },
    privacy: {
      title: 'سياسة الخصوصية',
      description: 'سياسة الخصوصية الخاصة بموقع بيت الزواحف.',
      keywords: joinKeywords(baseKeywords, 'سياسة الخصوصية', 'خصوصية متجر الزواحف'),
    },
    terms: {
      title: 'الشروط والأحكام',
      description: 'الشروط والأحكام المنظمة لاستخدام الموقع.',
      keywords: joinKeywords(baseKeywords, 'شروط الاستخدام', 'أحكام متجر الزواحف'),
    },
    returnPolicy: {
      title: 'سياسة الإرجاع',
      description: 'سياسة الإرجاع والاستبدال في المتجر.',
      keywords: joinKeywords(baseKeywords, 'إرجاع الزواحف', 'استبدال المنتجات', 'سياسة الاسترجاع'),
    },
    shippingPolicy: {
      title: 'سياسة الشحن',
      description: 'تفاصيل الشحن والتوصيل ومواعيد التسليم.',
      keywords: joinKeywords(baseKeywords, 'شحن الزواحف', 'توصيل الزواحف', 'سياسة الشحن'),
    },
    warranty: {
      title: 'الضمان والصحة',
      description: 'سياسة الضمان الصحي وتعليمات السلامة.',
      keywords: joinKeywords(baseKeywords, 'ضمان الزواحف', 'صحة الزواحف', 'سلامة تربية الزواحف'),
    },
  };

  if (currentPage.startsWith('product/')) {
    return {
      title: 'تفاصيل المنتج',
      description: 'تفاصيل منتج الزواحف والمواصفات والعناية.',
      keywords: joinKeywords(baseKeywords, 'تفاصيل منتج', 'سعر الزواحف', 'مواصفات الزواحف', 'شراء زواحف'),
    };
  }
  if (currentPage.startsWith('article/')) {
    return {
      title: 'تفاصيل المقال',
      description: 'اقرأ المقال التعليمي من مدونة بيت الزواحف.',
      keywords: joinKeywords(baseKeywords, 'مقال زواحف', 'معلومات عن الزواحف', 'تعليم تربية الزواحف'),
    };
  }

  return (
    mapping[currentPage] || {
      title: settings.defaultTitle,
      description: settings.defaultDescription,
      keywords: baseKeywords,
    }
  );
}

export function useSeoManager(currentPage: string, appMode: 'user' | 'dashboard') {
  const [settings, setSettings] = useState<SeoSettings>(defaultSeoSettings);

  useEffect(() => {
    let isCancelled = false;

    const loadSeo = async () => {
      try {
        const loaded = await api.getSeoSettings();
        if (!isCancelled) setSettings(normalizeLoadedSettings(loaded));
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
    const pagePath = pageToCanonicalPath(currentPage);
    const canonicalBase = normalizeBaseUrl(settings.canonicalBaseUrl || defaultSeoSettings.canonicalBaseUrl);
    const canonicalUrl = `${canonicalBase}${pagePath}`;
    const isNoIndex = isNonIndexablePage(appMode, currentPage);
    const title = isNoIndex
      ? `لوحة الإدارة ${separator} ${settings.siteName}`
      : `${pageMeta.title} ${separator} ${settings.siteName}`;
    const description = isNoIndex
      ? 'لوحة إدارة متجر بيت الزواحف.'
      : pageMeta.description || settings.defaultDescription;
    const keywordsBase = settings.defaultKeywords || defaultSeoSettings.defaultKeywords;
    const keywords = isNoIndex
      ? keywordsBase
      : pageMeta.keywords || keywordsBase;
    const robots = isNoIndex
      ? 'noindex, nofollow'
      : `${settings.robotsIndex ? 'index' : 'noindex'}, ${settings.robotsFollow ? 'follow' : 'nofollow'}, max-image-preview:large`;
    const image = resolveAbsoluteUrl(canonicalBase, settings.defaultOgImage || defaultSeoSettings.defaultOgImage);

    document.title = title;
    document.documentElement.lang = 'ar';

    setMetaByName('description', description);
    setMetaByName('keywords', keywords);
    setMetaByName('news_keywords', keywords);
    setMetaByName('robots', robots);
    setMetaByName('googlebot', robots);
    setMetaByName('theme-color', settings.themeColor || defaultSeoSettings.themeColor);

    if (settings.googleVerification) setMetaByName('google-site-verification', settings.googleVerification);
    else removeMetaByName('google-site-verification');

    if (settings.bingVerification) setMetaByName('msvalidate.01', settings.bingVerification);
    else removeMetaByName('msvalidate.01');

    if (settings.yandexVerification) setMetaByName('yandex-verification', settings.yandexVerification);
    else removeMetaByName('yandex-verification');

    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:title', title);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:image', image);
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:site_name', settings.siteName);
    setMetaByProperty('og:locale', settings.locale || 'ar_SY');

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', title);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', image);
    if (settings.twitterHandle) setMetaByName('twitter:site', settings.twitterHandle);
    else removeMetaByName('twitter:site');

    setCanonical(canonicalUrl);
    setAlternateLanguageLink('ar', canonicalUrl);
    setAlternateLanguageLink('x-default', canonicalUrl);
    setStructuredData(settings, canonicalUrl);
  }, [appMode, currentPage, pageMeta, settings]);
}
