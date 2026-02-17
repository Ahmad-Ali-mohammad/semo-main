
import React, { useState, useMemo, useRef } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { EditIcon, TrashIcon, PlusIcon, SearchIcon, StarIcon } from '../../components/icons';
import TabsSystem, { TabItem } from '../../components/TabSystem';
import ConfirmationModal from '../../components/ConfirmationModal';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { Reptile } from '../../types';
import { defaultCategories } from '../../constants';
import { helpContent } from '../../constants/helpContent';

const ProductsManagementPage: React.FC = () => {
    const { products, addProduct, deleteProduct } = useDatabase();
    const [activeTab, setActiveTab] = useState('all_products');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Reptile> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirmation Modal State
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    });

    const existingCategories = useMemo(() => {
        const cats = new Set<string>(products.map(p => p.category));
        const combined = [...defaultCategories];
        cats.forEach(c => {
            if (!combined.find(dc => dc.value === c)) {
                combined.push({ value: c as any, label: c });
            }
        });
        return combined;
    }, [products]);

    const productTabs: TabItem[] = [
      { id: 'all_products', label: 'جميع المنتجات', icon: '📦' },
      { id: 'featured', label: 'المميزة', icon: '✨' },
      { id: 'out_of_stock', label: 'نفذت من المخزون', icon: '❌', badge: products.filter(r => !r.isAvailable).length }
    ];

    const filteredReptiles = useMemo(() => {
        let list = products;
        if (activeTab === 'featured') list = products.filter(r => r.rating >= 4.9);
        if (activeTab === 'out_of_stock') list = products.filter(r => !r.isAvailable);
        
        if (searchQuery) {
            list = list.filter(r => 
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                r.species.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return list;
    }, [activeTab, products, searchQuery]);

    const handleOpenModal = (product?: Reptile) => {
        if (product) {
            setEditingProduct({ ...product });
        } else {
            setEditingProduct({
                id: 0,
                name: '',
                species: '',
                price: 0,
                imageUrl: '',
                category: 'snake',
                status: 'متوفر',
                isAvailable: true,
                rating: 5.0,
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            if (!editingProduct.category || !editingProduct.species || !editingProduct.imageUrl) {
                alert('يرجى ملء جميع الحقول المطلوبة ورفع صورة');
                return;
            }

            const productToSave: Reptile = {
                ...editingProduct as Reptile,
                category: editingProduct.category as any,
                species: editingProduct.species as string,
                price: Number(editingProduct.price) || 0,
                id: Number(editingProduct.id) || 0
            };

            addProduct(productToSave);
            setIsModalOpen(false);
            setEditingProduct(null);
        }
    };

    const handleDeleteClick = (id: number) => {
        setConfirmDelete({ isOpen: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            deleteProduct(confirmDelete.id);
        }
        setConfirmDelete({ isOpen: false, id: null });
    };

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة المنتجات</h1>
                    <p className="text-gray-400">إدارة الزواحف المتوفرة في المتجر</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative flex-1 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="ابحث في المتجر..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 px-6 ps-14 outline-none focus:ring-2 focus:ring-amber-500/50 text-white transition-all shadow-inner"
                    />
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة منتج جديد</span>
                </button>
            </div>

            <TabsSystem tabs={productTabs} activeTabId={activeTab} onChange={setActiveTab} />

            <div className="glass-medium rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden bg-[#11141b]/40">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-black/20">
                                <th className="p-6">المخلوق</th>
                                <th className="p-6 text-center">الفئة</th>
                                <th className="p-6">السعر</th>
                                <th className="p-6 text-center">الحالة</th>
                                <th className="p-6 text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredReptiles.map(reptile => (
                                <tr key={reptile.id} className="hover:bg-white/5 transition-all group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-gray-800 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                                                <img src={reptile.imageUrl} alt={reptile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black group-hover:text-amber-400 transition-colors text-lg truncate">{reptile.name}</p>
                                                <p className="text-xs text-gray-500 font-poppins">{reptile.species}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-300 font-bold bg-white/5 px-4 py-1.5 rounded-xl border border-white/5 text-xs">
                                            {existingCategories.find(c => c.value === reptile.category)?.label || reptile.category}
                                        </span>
                                    </td>
                                    <td className="p-6 font-poppins font-black text-amber-500 text-xl">${reptile.price}</td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase border ${
                                            reptile.isAvailable 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {reptile.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-start gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(reptile)}
                                                className="p-3 bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all border border-white/5"
                                                aria-label={`تعديل ${reptile.name}`}
                                            >
                                                <EditIcon className="w-5 h-5"/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(reptile.id)}
                                                className="p-3 bg-red-500/5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-500/10"
                                                aria-label={`حذف ${reptile.name}`}
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            <ConfirmationModal 
                isOpen={confirmDelete.isOpen}
                title="تأكيد الحذف النهائي"
                message="هل أنت متأكد تماماً من رغبتك في حذف هذا المخلوق من المتجر؟ هذه العملية نهائية ولا يمكن التراجع عنها."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق النافذة"
                    />
                    <form 
                        onSubmit={handleSave}
                        className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0f1117]"
                    >
                        <h2 className="text-4xl font-black mb-10 text-white tracking-tighter">
                            {editingProduct?.id ? 'تحديث بيانات المخلوق' : 'إضافة مخلوق جديد'}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right">
                            <div className="md:col-span-1 space-y-6">
                                <label htmlFor="product-image-upload" className="block text-xs font-black text-amber-500 uppercase tracking-widest">الصورة التعريفية</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="رفع صورة المنتج"
                                    className="relative aspect-square w-full rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-all overflow-hidden group"
                                >
                                    {editingProduct?.imageUrl ? (
                                        <img src={editingProduct.imageUrl} alt={editingProduct.name || 'صورة المنتج'} className="w-full h-full object-cover" />
                                    ) : (
                                        <PlusIcon className="w-12 h-12 text-gray-600" />
                                    )}
                                </div>
                                <input id="product-image-upload" type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} aria-label="اختيار صورة المنتج" />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label htmlFor="product-name" className="text-xs font-black text-amber-500 uppercase mb-2 block">الاسم</label>
                                    <input id="product-name" required className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold" value={editingProduct?.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="product-species" className="text-xs font-black text-amber-500 uppercase mb-2 block">الفصيلة</label>
                                    <input
                                        id="product-species"
                                        required
                                        type="text"
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                        value={editingProduct?.species || ''}
                                        onChange={e => setEditingProduct({...editingProduct, species: e.target.value})}
                                        placeholder="مثلاً: Ball python"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="product-category" className="text-xs font-black text-amber-500 uppercase mb-2 block">الفئة</label>
                                    <input
                                        id="product-category"
                                        required
                                        type="text"
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                        value={editingProduct?.category || ''}
                                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Reptile['category']})}
                                        placeholder="مثلاً: snake, lizard, turtle"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="product-price" className="text-xs font-black text-amber-500 uppercase mb-2 block">السعر</label>
                                    <input id="product-price" type="number" className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins" value={editingProduct?.price || 0} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label htmlFor="product-status" className="text-xs font-black text-amber-500 uppercase mb-2 block">حالة التوفر</label>
                                    <input
                                        id="product-status"
                                        required
                                        type="text"
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                        value={editingProduct?.status || ''}
                                        onChange={e => setEditingProduct({
                                            ...editingProduct,
                                            status: e.target.value as any,
                                            isAvailable: e.target.value === 'متوفر'
                                        })}
                                        placeholder="مثلاً: متوفر، قيد الحجز، غير متوفر"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="product-rating" className="text-xs font-black text-amber-500 uppercase mb-2 block">التقييم</label>
                                    <input
                                        id="product-rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                        value={editingProduct?.rating || 5.0}
                                        onChange={e => setEditingProduct({...editingProduct, rating: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="product-description" className="text-xs font-black text-amber-500 uppercase mb-2 block">الوصف</label>
                                    <textarea id="product-description" rows={4} className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white resize-none" value={editingProduct?.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-12">
                            <button type="submit" className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 shadow-2xl text-lg">حفظ التغييرات</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 text-gray-400 font-black rounded-[1.5rem] border border-white/5">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.products.title}
                sections={helpContent.products.sections}
            />
        </div>
    );
};

export default ProductsManagementPage;
