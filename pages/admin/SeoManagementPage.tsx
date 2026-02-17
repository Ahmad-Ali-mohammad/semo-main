import React, { useEffect, useState } from 'react';
import { SeoSettings } from '../../types';
import { api } from '../../services/api';
import { CheckCircleIcon, DocumentIcon } from '../../components/icons';

const defaultSeo: SeoSettings = {
  siteName: 'بيت الزواحف',
  defaultTitle: 'Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù | Ù…ØªØ¬Ø± Ø§Ù„Ø²ÙˆØ§Ø­Ù ÙˆØ§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª',
  titleSeparator: '|',
  defaultDescription: 'Ù…ØªØ¬Ø± Ù…ØªØ®ØµØµ Ø¨Ø§Ù„Ø²ÙˆØ§Ø­Ù ÙˆØ§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª Ù…Ø¹ Ù…Ø­ØªÙˆÙ‰ ØªØ¹Ù„ÙŠÙ…ÙŠ ÙˆØ¯Ø¹Ù… Ø§Ø­ØªØ±Ø§ÙÙŠ.',
  defaultKeywords: 'Ø²ÙˆØ§Ø­Ù, Ù…ØªØ¬Ø± Ø²ÙˆØ§Ø­Ù, Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª Ø²ÙˆØ§Ø­Ù, Ø«Ø¹Ø§Ø¨ÙŠÙ†, Ø³Ø­Ø§Ù„ÙŠ, Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
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
  organizationName: 'بيت الزواحف',
  organizationLogo: '/assets/photo_2026-02-04_07-13-35.jpg',
  organizationDescription: 'Ù…ØªØ¬Ø± Ù…ØªØ®ØµØµ Ø¨Ø§Ù„Ø²ÙˆØ§Ø­Ù ÙˆØ§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª Ù…Ø¹ Ù…Ø­ØªÙˆÙ‰ ØªØ¹Ù„ÙŠÙ…ÙŠ ÙˆØ¯Ø¹Ù… Ø§Ø­ØªØ±Ø§ÙÙŠ.',
  sitemapEnabled: true,
  excludedPaths: '/dashboard',
  customRobotsTxt: '',
};

const SeoManagementPage: React.FC = () => {
  const [settings, setSettings] = useState<SeoSettings>(defaultSeo);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const rows = await api.getSeoSettings();
        setSettings({ ...defaultSeo, ...rows });
      } catch {
        setError('تعذر تحميل إعدادات تحسين محركات البحث');
        setSettings(defaultSeo);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const payload = { ...defaultSeo, ...settings };
      const savedRow = await api.saveSeoSettings(payload);
        setSettings({ ...defaultSeo, ...savedRow });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('تعذر حفظ إعدادات تحسين محركات البحث');
    } finally {
      setIsSaving(false);
    }
  };

  const snippetTitle = `${settings.defaultTitle} ${settings.titleSeparator} ${settings.siteName}`.trim();

  return (
    <div className="animate-fade-in relative space-y-8 text-right">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2">لوحة تحسين محركات البحث</h1>
          <p className="text-gray-400">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ† ÙˆØ§Ù„ÙˆØµÙ ÙˆØ§Ù„ÙˆØ³ÙˆÙ… ÙˆÙ…Ø­Ø±ÙƒØ§Øª Ø§Ù„Ø¨Ø­Ø« ÙˆØ®Ø±Ø§Ø¦Ø· Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ù…Ù† Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-amber-500 text-gray-900 font-black py-3 px-6 rounded-2xl hover:bg-amber-400 disabled:opacity-60"
        >
          {isSaving ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...' : 'Ø­ÙØ¸ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/40 text-green-300 rounded-2xl p-4 text-sm font-bold flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          تم حفظ إعدادات تحسين محركات البحث بنجاح.
        </div>
      )}
      {error && <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-2xl p-4 text-sm font-bold">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-dark border border-white/10 rounded-[2rem] p-6 space-y-6">
          <h2 className="text-xl font-black text-amber-400">Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø¹Ø§Ù…Ø©</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="Ø§Ø³Ù… Ø§Ù„Ù…ÙˆÙ‚Ø¹" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§ÙØªØ±Ø§Ø¶ÙŠ" value={settings.defaultTitle} onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="ÙØ§ØµÙ„ Ø§Ù„Ø¹Ù†ÙˆØ§Ù†" value={settings.titleSeparator} onChange={(e) => setSettings({ ...settings, titleSeparator: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="Ø§Ù„Ø±Ø§Ø¨Ø· Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ canonical" value={settings.canonicalBaseUrl} onChange={(e) => setSettings({ ...settings, canonicalBaseUrl: e.target.value })} />
          </div>
          <textarea className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3 min-h-[90px]" placeholder="Ø§Ù„ÙˆØµÙ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ" value={settings.defaultDescription} onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })} />
          <textarea className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3 min-h-[70px]" placeholder="Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ© (Ù…ÙØµÙˆÙ„Ø© Ø¨ÙÙˆØ§ØµÙ„)" value={settings.defaultKeywords} onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value })} />

          <h2 className="text-xl font-black text-amber-400 pt-4">إعدادات OpenGraph وX (Twitter)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="ØµÙˆØ±Ø© OG Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ©" value={settings.defaultOgImage} onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="معرّف X (@...)" value={settings.twitterHandle} onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="اللغة المحلية (ar_SY)" value={settings.locale} onChange={(e) => setSettings({ ...settings, locale: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="لون السمة (#...)" value={settings.themeColor} onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })} />
          </div>

          <h2 className="text-xl font-black text-amber-400 pt-4">ÙÙ‡Ø±Ø³Ø© ÙˆÙ…Ø­Ø±ÙƒØ§Øª Ø¨Ø­Ø«</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.robotsIndex} onChange={(e) => setSettings({ ...settings, robotsIndex: e.target.checked })} />
              <span>Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø§Ù„Ø£Ø±Ø´ÙØ© (index)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.robotsFollow} onChange={(e) => setSettings({ ...settings, robotsFollow: e.target.checked })} />
              <span>Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø§ØªØ¨Ø§Ø¹ Ø§Ù„Ø±ÙˆØ§Ø¨Ø· (follow)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.sitemapEnabled} onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })} />
              <span>تفعيل خريطة الموقع sitemap.xml</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="رمز التحقق من Google" value={settings.googleVerification} onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="رمز التحقق من Bing" value={settings.bingVerification} onChange={(e) => setSettings({ ...settings, bingVerification: e.target.value })} />
            <input className="bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3" placeholder="رمز التحقق من Yandex" value={settings.yandexVerification} onChange={(e) => setSettings({ ...settings, yandexVerification: e.target.value })} />
          </div>
          <textarea className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3 min-h-[70px]" placeholder="Ù…Ø³Ø§Ø±Ø§Øª Ù…Ø³ØªØ«Ù†Ø§Ø© Ù…Ù† Ø§Ù„Ø£Ø±Ø´ÙØ© (Ø³Ø·Ø± Ù„ÙƒÙ„ Ù…Ø³Ø§Ø±)" value={settings.excludedPaths} onChange={(e) => setSettings({ ...settings, excludedPaths: e.target.value })} />
          <textarea className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-3 min-h-[100px]" placeholder="Ø¥Ø¶Ø§ÙØ§Øª robots.txt Ù…Ø®ØµØµØ©" value={settings.customRobotsTxt} onChange={(e) => setSettings({ ...settings, customRobotsTxt: e.target.value })} />
        </div>

        <div className="glass-dark border border-white/10 rounded-[2rem] p-6 space-y-4">
          <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
            <DocumentIcon className="w-5 h-5" />
            Ù…Ø¹Ø§ÙŠÙ†Ø© Ù†ØªÙŠØ¬Ø© Ø§Ù„Ø¨Ø­Ø«
          </h3>
          <div className="bg-[#11131a] border border-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-[#8ab4f8] text-lg leading-snug">{snippetTitle}</p>
            <p className="text-[#9aa0a6] text-sm truncate">{settings.canonicalBaseUrl}</p>
            <p className="text-[#bdc1c6] text-sm leading-relaxed">{settings.defaultDescription}</p>
          </div>
          <div className="text-xs text-gray-500 leading-6">
            <p>الروبوتات: {settings.robotsIndex ? 'index' : 'noindex'}, {settings.robotsFollow ? 'follow' : 'nofollow'}</p>
            <p>خريطة الموقع: {settings.sitemapEnabled ? 'مفعلة' : 'معطلة'}</p>
            <p>الرابط الأساسي: {settings.canonicalBaseUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoManagementPage;

