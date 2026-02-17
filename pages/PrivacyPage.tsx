import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { usePageContent } from '../hooks/usePageContent';
import { PageContent } from '../types';

const fallback: PageContent = {
  id: 'fallback-privacy',
  slug: 'privacy',
  title: 'سياسة الخصوصية',
  excerpt: 'كيف نجمع ونستخدم بياناتك.',
  content: `
    <h2>البيانات التي نجمعها</h2>
    <p>نقوم بجمع البيانات الضرورية لإتمام الطلبات وتحسين تجربة الاستخدام.</p>
    <h2>كيف نستخدم البيانات</h2>
    <p>نستخدم بياناتك لمعالجة الطلبات، وخدمة العملاء، وتطوير خدماتنا.</p>
    <h2>حماية البيانات</h2>
    <p>نلتزم بحماية بياناتك وعدم مشاركتها مع أطراف ثالثة لأغراض تسويقية دون موافقة.</p>
  `,
  seoTitle: 'سياسة الخصوصية - بيت الزواحف',
  seoDescription: 'تعرف على سياسة الخصوصية في متجر بيت الزواحف.',
  isActive: true,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const PrivacyPage: React.FC = () => {
  const { pageContent, loading } = usePageContent('privacy', fallback);

  if (loading) {
    return <div className="animate-fade-in text-center py-20">جاري التحميل...</div>;
  }

  return <PolicyPage title={pageContent.title} contentHtml={pageContent.content} />;
};

export default PrivacyPage;
