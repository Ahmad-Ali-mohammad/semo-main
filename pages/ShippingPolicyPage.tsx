import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { usePageContent } from '../hooks/usePageContent';
import { PageContent } from '../types';

const fallback: PageContent = {
  id: 'fallback-shipping',
  slug: 'shipping',
  title: 'سياسة الشحن والتوصيل',
  excerpt: 'تفاصيل الشحن داخل دمشق وباقي المحافظات.',
  content: `
    <h2>خيارات الشحن</h2>
    <p>نوفّر الشحن داخل دمشق وخارجها مع عناية خاصة لشحن الزواحف الحية.</p>
    <ul>
      <li><strong>داخل دمشق:</strong> 24-48 ساعة.</li>
      <li><strong>باقي المحافظات:</strong> 2-4 أيام عمل.</li>
    </ul>
    <h2>التكلفة</h2>
    <p>تعتمد تكلفة الشحن على الموقع ونوع الشحنة وتظهر قبل تأكيد الطلب.</p>
  `,
  seoTitle: 'سياسة الشحن - بيت الزواحف',
  seoDescription: 'سياسة الشحن والتوصيل المعتمدة في متجر بيت الزواحف.',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const ShippingPolicyPage: React.FC = () => {
  const { pageContent, loading } = usePageContent('shipping', fallback);

  if (loading) {
    return <div className="animate-fade-in text-center py-20">جاري التحميل...</div>;
  }

  return <PolicyPage title={pageContent.title} contentHtml={pageContent.content} />;
};

export default ShippingPolicyPage;
