import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { usePageContent } from '../hooks/usePageContent';
import { PageContent } from '../types';

const fallback: PageContent = {
  id: 'fallback-terms',
  slug: 'terms',
  title: 'الشروط والأحكام',
  excerpt: 'شروط استخدام متجر بيت الزواحف.',
  content: `
    <h2>قبول الشروط</h2>
    <p>باستخدامك لموقع Reptile House فإنك توافق على هذه الشروط والأحكام.</p>
    <h2>استخدام الموقع</h2>
    <p>يجب استخدام الموقع بشكل قانوني وعدم إساءة الاستخدام أو محاولة الوصول غير المصرح به.</p>
    <h2>التعديلات</h2>
    <p>قد نقوم بتحديث الشروط من وقت لآخر، واستمرار الاستخدام يعني الموافقة على النسخة الأحدث.</p>
  `,
  seoTitle: 'الشروط والأحكام - بيت الزواحف',
  seoDescription: 'الشروط والأحكام الخاصة باستخدام متجر بيت الزواحف.',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const TermsPage: React.FC = () => {
  const { pageContent, loading } = usePageContent('terms', fallback);

  if (loading) {
    return <div className="animate-fade-in text-center py-20">جاري التحميل...</div>;
  }

  return <PolicyPage title={pageContent.title} contentHtml={pageContent.content} />;
};

export default TermsPage;
