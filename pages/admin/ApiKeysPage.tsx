import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TrashIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    permissions: string[];
    createdAt: string;
    lastUsed?: string;
    usageCount: number;
    isActive: boolean;
    expiresAt?: string;
}

const ApiKeysPage: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
        {
            id: '1',
            name: 'مفتاح التطبيق الرئيسي',
            key: 'sk_live_51H2K3f...9f3K2L',
            permissions: ['read', 'write', 'delete'],
            createdAt: '2024-01-15',
            lastUsed: '2024-02-04',
            usageCount: 1247,
            isActive: true,
            expiresAt: '2025-01-15'
        },
        {
            id: '2',
            name: 'مفتاح القراءة فقط',
            key: 'sk_live_51H2K3f...8f2J1M',
            permissions: ['read'],
            createdAt: '2024-01-20',
            lastUsed: '2024-02-03',
            usageCount: 89,
            isActive: true,
            expiresAt: '2024-07-20'
        },
        {
            id: '3',
            name: 'مفتاح المطور',
            key: 'sk_test_51H2K3f...7g3N1P',
            permissions: ['read', 'write'],
            createdAt: '2024-02-01',
            lastUsed: '2024-02-04',
            usageCount: 45,
            isActive: true
        }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [newKey, setNewKey] = useState({
        name: '',
        permissions: ['read'],
        expiresAt: ''
    });

    const filteredKeys = apiKeys.filter(key =>
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateApiKey = () => {
        const prefix = 'sk_live_';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 24; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return prefix + result;
    };

    const handleCreateKey = () => {
        if (!newKey.name) {
            globalThis.alert('يرجى إدخال اسم المفتاح');
            return;
        }

        const key: ApiKey = {
            id: Date.now().toString(),
            name: newKey.name,
            key: generateApiKey(),
            permissions: newKey.permissions,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0,
            isActive: true,
            expiresAt: newKey.expiresAt || undefined
        };

        setApiKeys([...apiKeys, key]);
        setNewKey({ name: '', permissions: ['read'], expiresAt: '' });
        setShowCreateModal(false);
        globalThis.alert('تم إنشاء المفتاح بنجاح');
    };

    const handleDeleteKey = (keyId: string) => {
        if (globalThis.confirm('هل أنت متأكد من حذف هذا المفتاح؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            setApiKeys(apiKeys.filter(key => key.id !== keyId));
            globalThis.alert('تم حذف المفتاح بنجاح');
        }
    };

    const handleToggleKey = (keyId: string) => {
        setApiKeys(apiKeys.map(key =>
            key.id === keyId ? { ...key, isActive: !key.isActive } : key
        ));
    };

    const handleRegenerateKey = (keyId: string) => {
        if (globalThis.confirm('هل أنت متأكد من تجديد هذا المفتاح؟ سيفقد المفتاح القديم صلاحيته.')) {
            setApiKeys(apiKeys.map(key =>
                key.id === keyId ? { ...key, key: generateApiKey() } : key
            ));
            globalThis.alert('تم تجديد المفتاح بنجاح');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        globalThis.alert('تم نسخ المفتاح إلى الحافظة');
    };

    const toggleKeyVisibility = (keyId: string) => {
        setShowKey({ ...showKey, [keyId]: !showKey[keyId] });
    };

    const getPermissionBadge = (permission: string) => {
        const colors = {
            read: 'bg-blue-500/20 text-blue-400',
            write: 'bg-amber-500/20 text-amber-400',
            delete: 'bg-red-500/20 text-red-400'
        };
        const labels = {
            read: 'قراءة',
            write: 'كتابة',
            delete: 'حذف'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-black ${colors[permission as keyof typeof colors]}`}>
                {labels[permission as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">مفاتيح الواجهة البرمجية</h1>
                        <p className="text-gray-400">إدارة مفاتيح واجهة برمجة التطبيقات والوصول إلى النظام</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-amber-500 text-gray-900 font-black px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    إنشاء مفتاح جديد
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">إجمالي المفاتيح</p>
                            <p className="text-2xl font-black text-white">{apiKeys.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🔑</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">المفاتيح النشطة</p>
                            <p className="text-2xl font-black text-white">{apiKeys.filter(k => k.isActive).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">إجمالي الاستخدام</p>
                            <p className="text-2xl font-black text-white">
                                {apiKeys.reduce((sum, key) => sum + key.usageCount, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">مفاتيح منتهية الصلاحية</p>
                            <p className="text-2xl font-black text-white">
                                {apiKeys.filter(k => k.expiresAt && new Date(k.expiresAt) < new Date()).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="البحث عن مفتاح..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Application API Keys Table */}
            <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المفتاح</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الصلاحيات</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحالة</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الاستخدام</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإنشاء</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKeys.map((apiKey) => (
                                <tr key={apiKey.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-black text-white mb-1">{apiKey.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400 font-mono">
                                                    {showKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 20) + '...'}
                                                </span>
                                                <button
                                                    onClick={() => toggleKeyVisibility(apiKey.id)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                    aria-label={showKey[apiKey.id] ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
                                                >
                                                    👁
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(apiKey.key)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                    aria-label="نسخ المفتاح إلى الحافظة"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {apiKey.permissions.map(permission => (
                                                <span key={permission}>
                                                    {getPermissionBadge(permission)}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleKey(apiKey.id)}
                                                className={`w-12 h-6 rounded-full transition-colors ${apiKey.isActive ? 'bg-green-500' : 'bg-gray-600'
                                                    }`}
                                                aria-label={`${apiKey.isActive ? 'تعطيل' : 'تفعيل'} المفتاح`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${apiKey.isActive ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                            </button>
                                            <span className={`text-sm font-black ${apiKey.isActive ? 'text-green-400' : 'text-gray-500'
                                                }`}>
                                                {apiKey.isActive ? 'نشط' : 'معطل'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <div className="text-white font-black">{apiKey.usageCount}</div>
                                            <div className="text-xs text-gray-400">
                                                آخر استخدام: {apiKey.lastUsed || 'لم يستخدم'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <div className="text-white">{new Date(apiKey.createdAt).toLocaleDateString('ar-SY')}</div>
                                            {apiKey.expiresAt && (
                                                <div className="text-xs text-gray-400">
                                                    ينتهي: {new Date(apiKey.expiresAt).toLocaleDateString('ar-SY')}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => handleRegenerateKey(apiKey.id)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                title="تجديد المفتاح"
                                            >
                                                🔄
                                            </button>
                                            <button
                                                onClick={() => handleDeleteKey(apiKey.id)}
                                                className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                                title="حذف المفتاح"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Key Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-medium rounded-3xl border border-white/10 max-w-md w-full p-8">
                        <h2 className="text-2xl font-black text-white mb-6">إنشاء مفتاح واجهة برمجية جديد</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="api-key-name" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">اسم المفتاح</label>
                                <input
                                    id="api-key-name"
                                    type="text"
                                    value={newKey.name}
                                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                                    placeholder="مثال: مفتاح التطبيق الرئيسي"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الصلاحيات</label>
                                <div className="space-y-2">
                                    {['read', 'write', 'delete'].map(permission => (
                                        <label key={permission} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newKey.permissions.includes(permission)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewKey({ ...newKey, permissions: [...newKey.permissions, permission] });
                                                    } else {
                                                        setNewKey({ ...newKey, permissions: newKey.permissions.filter(p => p !== permission) });
                                                    }
                                                }}
                                                className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-white">
                                                {permission === 'read' ? 'قراءة' : permission === 'write' ? 'كتابة' : 'حذف'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="api-key-expires" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">تاريخ انتهاء الصلاحية (اختياري)</label>
                                <input
                                    id="api-key-expires"
                                    type="date"
                                    value={newKey.expiresAt}
                                    onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleCreateKey}
                                className="px-6 py-3 bg-amber-500 text-gray-900 font-black rounded-xl hover:bg-amber-400 transition-colors"
                            >
                                إنشاء المفتاح
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.settings}
            />
        </div>
    );
};

export default ApiKeysPage;
