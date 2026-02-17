import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { usePageContent } from '../hooks/usePageContent';
import { PageContent } from '../types';

const fallback: PageContent = {
  id: 'fallback-warranty',
  slug: 'warranty',
  title: 'سياسة الضمان والصحة',
  excerpt: 'ضمان صحة الزواحف وشروط الاستفادة من الضمان.',
  content: `
    <h2>ضمان صحة الزواحف</h2>
    <p>نضمن سلامة الزواحف وقت البيع ونقدّم ضمانًا صحيًا محدودًا بعد التسليم.</p>
    <h2>شروط الضمان</h2>
    <p>يتطلب الضمان تجهيز بيئة مناسبة للحيوان (حرارة، رطوبة، مسكن) قبل الاستلام.</p>
    <h2>طريقة المطالبة</h2>
    <p>يرجى التواصل فورًا مع فريق الدعم وإرسال صور أو فيديو في حال وجود مشكلة.</p>
  `,
  seoTitle: 'سياسة الضمان - بيت الزواحف',
  seoDescription: 'سياسة الضمان والصحة الخاصة بالزواحف في متجر بيت الزواحف.',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const WarrantyPage: React.FC = () => {
  const { pageContent, loading } = usePageContent('warranty', fallback);

  if (loading) {
    return <div className="animate-fade-in text-center py-20">جاري التحميل...</div>;
  }

  return <PolicyPage title={pageContent.title} contentHtml={pageContent.content} />;
};

export default WarrantyPage;
