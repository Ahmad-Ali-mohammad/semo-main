import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mediaService } from '../../services/media';
import { MediaFolder, MediaItem } from '../../types';
import { CloudUploadIcon, TrashIcon, SearchIcon, ImageIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const MediaLibraryPage: React.FC = () => {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFolderId, setActiveFolderId] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const values = Array.from(new Set(images.map((img) => img.category).filter(Boolean))) as string[];
    return values.sort((a, b) => a.localeCompare(b));
  }, [images]);

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [imgs, foldersData] = await Promise.all([
        mediaService.getImages(activeFolderId || undefined, activeCategory || undefined),
        mediaService.getFolders(),
      ]);
      setImages(imgs);
      setFolders(foldersData);
    } catch (err) {
      console.error(err);
      setError('تعذر تحميل مكتبة الوسائط.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeFolderId]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`الملف "${file.name}" ليس صورة.`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`حجم "${file.name}" أكبر من 5MB.`);
        }
      }

      await Promise.all(
        Array.from(files).map((file) =>
          mediaService.uploadImage(file, activeFolderId || undefined, activeCategory || undefined)
        )
      );
      await loadMedia();
    } catch (err) {
      console.error('Upload failed', err);
      setError(err instanceof Error ? err.message : 'فشل رفع الصور.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => processFiles(e.target.files);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm('هل أنت متأكد من حذف هذه الصورة نهائيًا؟')) return;
    try {
      await mediaService.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
      setError('تعذر حذف الصورة.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!globalThis.confirm(`سيتم حذف ${selectedIds.length} ملفًا نهائيًا. متابعة؟`)) return;
    try {
      await mediaService.bulkDeleteImages(selectedIds);
      setImages((prev) => prev.filter((img) => !selectedIds.includes(img.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      setError('تعذر حذف الملفات المحددة.');
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
      setError('تعذر نسخ الرابط.');
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-right pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 text-white">مكتبة الوسائط</h1>
            <p className="text-gray-500 font-bold">إدارة الصور والملفات المرئية للمتجر بالكامل.</p>
          </div>
          <HelpButton onClick={() => setIsHelpOpen(true)} />
        </div>
        <div className="flex gap-3 flex-wrap w-full md:w-auto">
          <div className="relative flex-1 min-w-[220px] md:w-72">
            <input
              type="text"
              placeholder="بحث في الصور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3 px-6 ps-14 text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <select
            value={activeFolderId}
            onChange={(e) => {
              setActiveFolderId(e.target.value);
              setSelectedIds([]);
            }}
            className="bg-[#1a1c23] border border-white/10 rounded-2xl py-3 px-4 text-white"
          >
            <option value="">كل المجلدات</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
          <select
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setSelectedIds([]);
            }}
            className="bg-[#1a1c23] border border-white/10 rounded-2xl py-3 px-4 text-white"
          >
            <option value="">كل التصنيفات</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadMedia}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white hover:bg-white/10"
          >
            تحديث
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-2xl p-4 text-sm font-bold">
          {error}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="glass-medium border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-gray-300">تم تحديد {selectedIds.length} ملفًا.</p>
          <button
            type="button"
            onClick={handleBulkDelete}
            className="bg-red-500/20 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl hover:bg-red-500/30"
          >
            حذف المحدد
          </button>
        </div>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="منطقة رفع الصور"
        className={`relative border-2 border-dashed rounded-[3rem] p-16 text-center transition-all duration-500 cursor-pointer group overflow-hidden ${
          isDragging ? 'border-amber-500 bg-amber-500/10 scale-[0.99]' : 'border-white/10 bg-white/5 hover:border-amber-500/30'
        }`}
      >
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className={`p-6 rounded-3xl transition-all duration-500 ${isDragging ? 'bg-amber-500 text-gray-900 scale-110 rotate-12' : 'bg-white/5 text-amber-500'}`}>
            <CloudUploadIcon className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">اسحب الصور هنا أو اضغط للرفع</h2>
            <p className="text-gray-500 font-bold">صيغة صورة فقط، والحد الأقصى 5MB للملف</p>
          </div>
          {(isUploading || isLoading) && (
            <div className="flex items-center gap-3 bg-gray-900/80 px-6 py-3 rounded-2xl border border-white/10">
              <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
              <span className="text-amber-500 font-black text-sm uppercase">
                {isUploading ? 'جاري الرفع والمعالجة...' : 'جاري التحميل...'}
              </span>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleUpload} aria-label="رفع الصور" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {filteredImages.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 hover:border-amber-500 transition-all shadow-xl animate-scale-in">
            <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

            <label className="absolute top-3 right-3 z-20 bg-black/70 rounded-lg px-2 py-1 flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(img.id)}
                onChange={(e) => toggleSelect(img.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4"
              />
            </label>

            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-6 text-center space-y-4">
              <p className="text-[10px] text-white font-black truncate w-full px-2">{img.name}</p>
              <span className="text-[8px] text-gray-500 font-poppins">{img.size}</span>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(img.url, img.id);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${copiedId === img.id ? 'bg-green-500 text-white' : 'bg-amber-500 text-gray-900 hover:bg-amber-400'}`}
                >
                  {copiedId === img.id ? 'تم النسخ' : 'نسخ الرابط'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  className="p-2.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                  aria-label={`حذف ${img.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {copiedId === img.id && (
              <div className="absolute top-4 left-4 text-green-400 bg-black/60 p-1.5 rounded-full backdrop-blur-md">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && !isUploading && !isLoading && (
        <div className="py-24 glass-medium rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
          <ImageIcon className="w-16 h-16 text-gray-500" />
          <p className="text-xl font-black">لا توجد وسائط مطابقة لخيارات البحث الحالية</p>
        </div>
      )}

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        content={helpContent.media}
      />
    </div>
  );
};

export default MediaLibraryPage;

