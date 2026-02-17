import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { usePageContent } from '../hooks/usePageContent';
import { PageContent } from '../types';

const fallback: PageContent = {
  id: 'fallback-returns',
  slug: 'returns',
  title: 'سياسة الإرجاع والاستبدال',
  excerpt: 'تفاصيل الإرجاع والاستبدال للمنتجات والمستلزمات.',
  content: `
    <h2>الزواحف الحية</h2>
    <p>لا يمكن إرجاع الزواحف الحية بعد التسليم، مع ضمان وصولها بحالة صحية جيدة.</p>
    <h2>المستلزمات</h2>
    <p>يمكن إرجاع المستلزمات غير المستخدمة خلال 7 أيام مع الفاتورة الأصلية.</p>
  `,
  seoTitle: 'سياسة الإرجاع - بيت الزواحف',
  seoDescription: 'سياسة الإرجاع والاستبدال المعتمدة في متجر بيت الزواحف.',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const ReturnPolicyPage: React.FC = () => {
  const { pageContent, loading } = usePageContent('returns', fallback);

  if (loading) {
    return <div className="animate-fade-in text-center py-20">جاري التحميل...</div>;
  }

  return <PolicyPage title={pageContent.title} contentHtml={pageContent.content} />;
};

export default ReturnPolicyPage;
