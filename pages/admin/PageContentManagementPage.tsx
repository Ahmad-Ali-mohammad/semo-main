import React, { useEffect, useMemo, useState } from 'react';
import { PageContent } from '../../types';
import { api } from '../../services/api';
import { PlusIcon, EditIcon, TrashIcon, DocumentIcon, CheckCircleIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';

const defaultPages: PageContent[] = [
  {
    id: 'page-home',
    slug: 'home',
    title: 'Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    excerpt: 'Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ÙˆØ§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ† Ø§Ù„ØªØ³ÙˆÙŠÙ‚ÙŠØ©.',
    content: 'Ø­Ø±Ø± Ù†ØµÙˆØµ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ù…Ù† Ù‡Ù†Ø§.',
    seoTitle: 'Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù - Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    seoDescription: 'Ø£ÙØ¶Ù„ Ù…ØªØ¬Ø± Ù„Ù„Ø²ÙˆØ§Ø­Ù ÙˆØ§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-about',
    slug: 'about',
    title: 'Ù…Ù† Ù†Ø­Ù†',
    excerpt: 'Ù…Ø­ØªÙˆÙ‰ ØµÙØ­Ø© Ù…Ù† Ù†Ø­Ù† ÙˆØ±Ø³Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±.',
    content: 'Ø­Ø±Ø± Ù‚ØµØ© Ø§Ù„Ù…ØªØ¬Ø± ÙˆØ§Ù„Ø±Ø¤ÙŠØ© ÙˆØ§Ù„Ù‚ÙŠÙ….',
    seoTitle: 'Ù…Ù† Ù†Ø­Ù† - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙØ±ÙŠÙ‚ Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Ø§ØªØµÙ„ Ø¨Ù†Ø§',
    excerpt: 'Ù…Ø­ØªÙˆÙ‰ ØµÙØ­Ø© Ø§Ù„ØªÙˆØ§ØµÙ„ ÙˆØ§Ù„ØªØ¹Ù„ÙŠÙ…Ø§Øª.',
    content: 'Ø­Ø±Ø± Ù†ØµÙˆØµ Ø§Ù„ØªÙˆØ§ØµÙ„ ÙˆÙ†Ù…Ø§Ø°Ø¬ Ø§Ù„Ø·Ù„Ø¨.',
    seoTitle: 'Ø§ØªØµÙ„ Ø¨Ù†Ø§ - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ù„Ø£ÙŠ Ø§Ø³ØªÙØ³Ø§Ø± Ø£Ùˆ Ø·Ù„Ø¨.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©',
    excerpt: 'Ø³ÙŠØ§Ø³Ø© Ø®ØµÙˆØµÙŠØ© Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ†.',
    content: '<h2>سياسة الخصوصية</h2><p>يمكنك تعديل محتوى هذه الصفحة من لوحة إدارة المحتوى.</p>',
    seoTitle: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ© - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ© ÙÙŠ Ù…ØªØ¬Ø± Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Ø§Ù„Ø´Ø±ÙˆØ· ÙˆØ§Ù„Ø£Ø­ÙƒØ§Ù…',
    excerpt: 'Ø§Ù„Ø´Ø±ÙˆØ· Ø§Ù„Ø¹Ø§Ù…Ø© Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù…ÙˆÙ‚Ø¹.',
    content: '<h2>الشروط والأحكام</h2><p>يمكنك تعديل محتوى هذه الصفحة من لوحة إدارة المحتوى.</p>',
    seoTitle: 'Ø§Ù„Ø´Ø±ÙˆØ· ÙˆØ§Ù„Ø£Ø­ÙƒØ§Ù… - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'Ø´Ø±ÙˆØ· ÙˆØ£Ø­ÙƒØ§Ù… Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù….',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-returns',
    slug: 'returns',
    title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹',
    excerpt: 'Ø§Ù„Ø´Ø±ÙˆØ· Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø¥Ø±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„.',
    content: '<h2>سياسة الإرجاع</h2><p>يمكنك تعديل محتوى هذه الصفحة من لوحة إدارة المحتوى.</p>',
    seoTitle: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹ - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-shipping',
    slug: 'shipping',
    title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø´Ø­Ù†',
    excerpt: 'Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø´Ø­Ù† ÙˆØ®ÙŠØ§Ø±Ø§Øª Ø§Ù„ØªÙˆØµÙŠÙ„.',
    content: '<h2>سياسة الشحن</h2><p>يمكنك تعديل محتوى هذه الصفحة من لوحة إدارة المحتوى.</p>',
    seoTitle: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø´Ø­Ù† - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'page-warranty',
    slug: 'warranty',
    title: 'Ø§Ù„Ø¶Ù…Ø§Ù† ÙˆØ§Ù„ØµØ­Ø©',
    excerpt: 'ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø¶Ù…Ø§Ù† Ø§Ù„ØµØ­ÙŠ Ù„Ù„Ø²ÙˆØ§Ø­Ù.',
    content: '<h2>الضمان والصحة</h2><p>يمكنك تعديل محتوى هذه الصفحة من لوحة إدارة المحتوى.</p>',
    seoTitle: 'Ø§Ù„Ø¶Ù…Ø§Ù† ÙˆØ§Ù„ØµØ­Ø© - Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù',
    seoDescription: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¶Ù…Ø§Ù† Ø§Ù„ØµØ­ÙŠ.',
    isActive: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  },
];

const PageContentManagementPage: React.FC = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const loadContents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const rows = await api.getPageContents();
      if (rows.length === 0) {
        setContents(defaultPages);
      } else {
        setContents(rows);
      }
    } catch (e) {
      setError('ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØµÙØ­Ø§Øª');
      setContents(defaultPages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, []);

  const activeCount = useMemo(() => contents.filter((item) => item.isActive).length, [contents]);

  const handleOpenCreate = () => {
    setEditingItem({
      id: '',
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      seoTitle: '',
      seoDescription: '',
      isActive: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PageContent) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.slug.trim() || !editingItem.title.trim() || !editingItem.content.trim()) {
      setError('Ø§Ù„Ø±Ø¬Ø§Ø¡ ØªØ¹Ø¨Ø¦Ø© Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©');
      return;
    }

    setIsSaving(true);
    setError('');
    const payload: PageContent = {
      ...editingItem,
      id: editingItem.id || '',
      slug: editingItem.slug.trim().toLowerCase(),
      title: editingItem.title.trim(),
      content: editingItem.content.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    try {
      await api.savePageContent(payload);
      await loadContents();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch {
      setError('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØµÙØ­Ø©');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = confirmDelete.id;
    if (!id) return;
    try {
      await api.deletePageContent(id);
      await loadContents();
    } catch {
      setError('ØªØ¹Ø°Ø± Ø­Ø°Ù Ø§Ù„Ù…Ø­ØªÙˆÙ‰');
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  return (
    <div className="animate-fade-in relative space-y-8 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">إدارة محتوى الصفحات</h1>
          <p className="text-gray-400">إدارة نصوص الصفحات الثابتة، النشر، وبيانات تحسين محركات البحث من لوحة واحدة.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>ØµÙØ­Ø© Ø¬Ø¯ÙŠØ¯Ø©</span>
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 font-bold text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold mb-1">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„ØµÙØ­Ø§Øª</p>
              <p className="text-3xl font-black text-amber-400 font-poppins">{contents.length}</p>
            </div>
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl"><DocumentIcon className="w-8 h-8" /></div>
          </div>
        </div>
        <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold mb-1">Ø§Ù„ØµÙØ­Ø§Øª Ø§Ù„Ù…Ù†Ø´ÙˆØ±Ø©</p>
              <p className="text-3xl font-black text-green-400 font-poppins">{activeCount}</p>
            </div>
            <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl"><CheckCircleIcon className="w-8 h-8" /></div>
          </div>
        </div>
        <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold mb-1">Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«</p>
              <p className="text-lg font-black text-blue-400">{contents[0]?.updatedAt || '-'}</p>
            </div>
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl"><DocumentIcon className="w-8 h-8" /></div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-medium rounded-[2rem] border border-white/10 p-10 text-center text-gray-400 font-bold">Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contents.map((item) => (
            <div key={item.id} className={`glass-dark border rounded-[2rem] p-6 transition-all ${item.isActive ? 'border-white/10' : 'border-gray-500/30 opacity-70'}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black mb-1">{item.title}</h3>
                    <p className="text-xs text-amber-400 font-bold">/{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEdit(item)} className="p-2 bg-white/5 text-gray-300 hover:text-amber-400 rounded-lg transition-all border border-white/10" aria-label="ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: item.id })} className="p-2 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/30" aria-label="Ø­Ø°Ù Ø§Ù„Ù…Ø­ØªÙˆÙ‰">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">{item.excerpt || item.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-500">Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«: {item.updatedAt}</span>
                  <span className={`text-xs px-3 py-1 rounded-lg font-bold ${item.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                    {item.isActive ? 'Ù…Ù†Ø´ÙˆØ±Ø©' : 'Ù…Ø³ÙˆØ¯Ø©'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default" onClick={() => setIsModalOpen(false)} aria-label="Ø¥ØºÙ„Ø§Ù‚" />
          <form onSubmit={handleSave} className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0f1117] space-y-6">
            <h2 className="text-3xl font-black">{editingItem.id ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰' : 'Ø¥Ø¶Ø§ÙØ© ØµÙØ­Ø© Ø¬Ø¯ÙŠØ¯Ø©'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cms-page-title" className="text-xs font-black text-amber-500 uppercase mb-2 block">Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ØµÙØ­Ø© *</label>
                <input
                  id="cms-page-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                  required
                />
              </div>
              <div>
                <label htmlFor="cms-page-slug" className="text-xs font-black text-amber-500 uppercase mb-2 block">المعرّف الرابطي للصفحة *</label>
                <input
                  id="cms-page-slug"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                  placeholder="about, contact, shipping-policy"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="cms-page-excerpt" className="text-xs font-black text-amber-500 uppercase mb-2 block">ÙˆØµÙ Ù…Ø®ØªØµØ±</label>
                <textarea
                  id="cms-page-excerpt"
                  rows={2}
                  value={editingItem.excerpt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="cms-page-content" className="text-xs font-black text-amber-500 uppercase mb-2 block">Ø§Ù„Ù…Ø­ØªÙˆÙ‰ *</label>
                <textarea
                  id="cms-page-content"
                  rows={10}
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed"
                  required
                />
              </div>
              <div>
                <label htmlFor="cms-page-seo-title" className="text-xs font-black text-amber-500 uppercase mb-2 block">عنوان تحسين محركات البحث</label>
                <input
                  id="cms-page-seo-title"
                  value={editingItem.seoTitle || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, seoTitle: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white"
                />
              </div>
              <div>
                <label htmlFor="cms-page-seo-description" className="text-xs font-black text-amber-500 uppercase mb-2 block">وصف تحسين محركات البحث</label>
                <input
                  id="cms-page-seo-description"
                  value={editingItem.seoDescription || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, seoDescription: e.target.value })}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-white font-bold">Ù†Ø´Ø± Ø§Ù„ØµÙØ­Ø© Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙˆÙ‚Ø¹</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isSaving} className="flex-1 bg-amber-500 text-gray-900 font-black py-4 rounded-2xl hover:bg-amber-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {isSaving ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...' : 'Ø­ÙØ¸ Ø§Ù„Ù…Ø­ØªÙˆÙ‰'}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 text-gray-400 font-black rounded-2xl border border-white/10">Ø¥Ù„ØºØ§Ø¡</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title="Ø­Ø°Ù Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØµÙØ­Ø©"
        message="Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ØŸ Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ±Ø§Ø¬Ø¹ Ø¨Ø¹Ø¯ Ø§Ù„Ø­Ø°Ù."
        confirmLabel="Ø­Ø°Ù Ø§Ù„Ù…Ø­ØªÙˆÙ‰"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default PageContentManagementPage;
