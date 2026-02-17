import React, { useState } from 'react';
import { TrashIcon, CloudUploadIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

interface Backup {
    id: string;
    name: string;
    size: string;
    date: string;
    type: 'full' | 'products' | 'orders' | 'customers' | 'settings';
    status: 'completed' | 'in_progress' | 'failed';
    description: string;
}

const BackupPage: React.FC = () => {
    const [backups, setBackups] = useState<Backup[]>([
        {
            id: '1',
            name: 'نسخة احتياطية كاملة - 2024-02-04',
            size: '45.2 MB',
            date: '2024-02-04 03:30:00',
            type: 'full',
            status: 'completed',
            description: 'نسخة احتياطية شاملة لقاعدة البيانات'
        },
        {
            id: '2',
            name: 'نسخة المنتجات - 2024-02-03',
            size: '12.8 MB',
            date: '2024-02-03 15:45:00',
            type: 'products',
            status: 'completed',
            description: 'نسخة احتياطية لبيانات المنتجات'
        },
        {
            id: '3',
            name: 'نسخة الطلبات - 2024-02-02',
            size: '8.5 MB',
            date: '2024-02-02 12:20:00',
            type: 'orders',
            status: 'completed',
            description: 'نسخة احتياطية لبيانات الطلبات'
        },
        {
            id: '4',
            name: 'نسخة العملاء - 2024-02-01',
            size: '3.2 MB',
            date: '2024-02-01 09:15:00',
            type: 'customers',
            status: 'completed',
            description: 'نسخة احتياطية لبيانات العملاء'
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [backupType, setBackupType] = useState<'full' | 'products' | 'orders' | 'customers' | 'settings'>('full');
    const [autoBackup, setAutoBackup] = useState({
        enabled: true,
        frequency: 'daily',
        time: '03:00',
        retention: 30
    });

    const backupTypes = [
        { value: 'full', label: 'نسخة كاملة', description: 'جميع بيانات المتجر', icon: '🗄️' },
        { value: 'products', label: 'المنتجات', description: 'بيانات المنتجات والمخزون', icon: '📦' },
        { value: 'orders', label: 'الطلبات', description: 'بيانات الطلبات والعملاء', icon: '📋' },
        { value: 'customers', label: 'العملاء', description: 'بيانات العملاء والمستخدمين', icon: '👥' },
        { value: 'settings', label: 'الإعدادات', description: 'إعدادات المتجر والنظام', icon: '⚙️' }
    ];

    const frequencies = [
        { value: 'daily', label: 'يوميً' },
        { value: 'weekly', label: 'أسبوعيً' },
        { value: 'monthly', label: 'شهريً' }
    ];

    const handleCreateBackup = async () => {
        setIsCreating(true);

        // Simulate backup creation
        const newBackup: Backup = {
            id: Date.now().toString(),
            name: `نسخة ${backupTypes.find(t => t.value === backupType)?.label} - ${new Date().toLocaleDateString('ar-SY')}`,
            size: '0 MB',
            date: new Date().toISOString(),
            type: backupType,
            status: 'in_progress',
            description: `جاري إنشاء نسخة احتياطية ${backupTypes.find(t => t.value === backupType)?.label.toLowerCase()}...`
        };

        setBackups([newBackup, ...backups]);

        // Simulate backup completion
        setTimeout(() => {
            setBackups(prev => prev.map(b =>
                b.id === newBackup.id ? {
                    ...b,
                    status: 'completed',
                    size: `${(Math.random() * 50 + 10).toFixed(1)} MB`
                } : b
            ));
            setIsCreating(false);
        }, 3000);
    };

    const handleRestoreBackup = (backup: Backup) => {
        setSelectedBackup(backup);
        setShowRestoreModal(true);
    };

    const confirmRestore = () => {
        if (!selectedBackup) return;

        // Simulate restore process
        globalThis.alert(`سيتم استعادة النسخة الاحتياطية "${selectedBackup.name}" بنجاح`);
        setShowRestoreModal(false);
        setSelectedBackup(null);
    };

    const handleDeleteBackup = (backupId: string) => {
        if (globalThis.confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            setBackups(backups.filter(b => b.id !== backupId));
            globalThis.alert('تم حذف النسخة الاحتياطية بنجاح');
        }
    };

    const handleDownloadBackup = (backup: Backup) => {
        globalThis.alert(`سيتم تحميل النسخة الاحتياطية "${backup.name}"`);
    };

    const getStatusBadge = (status: Backup['status']) => {
        const styles = {
            completed: 'bg-green-500/20 text-green-400',
            in_progress: 'bg-amber-500/20 text-amber-400',
            failed: 'bg-red-500/20 text-red-400'
        };
        const labels = {
            completed: 'مكتمل',
            in_progress: 'قيد التنفيذ',
            failed: 'فشل'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-black ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getTypeBadge = (type: Backup['type']) => {
        const colors = {
            full: 'bg-blue-500/20 text-blue-400',
            products: 'bg-amber-500/20 text-amber-400',
            orders: 'bg-green-500/20 text-green-400',
            customers: 'bg-purple-500/20 text-purple-400',
            settings: 'bg-gray-500/20 text-gray-400'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-black ${colors[type]}`}>
                {backupTypes.find(t => t.value === type)?.label}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">النسخ الاحتياطي</h1>
                        <p className="text-gray-400">إدارة نسخ احتياطي قاعدة البيانات واستعادتها</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <button
                    onClick={handleCreateBackup}
                    disabled={isCreating}
                    className="bg-amber-500 text-gray-900 font-black px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <CloudUploadIcon className="w-5 h-5" />
                    {isCreating ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطي'}
                </button>
            </div>

            {/* Auto Backup Settings */}
            <div className="glass-medium rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-black text-white mb-6">النسخ الاحتياطي التلقائي</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoBackup.enabled}
                                onChange={(e) => setAutoBackup({ ...autoBackup, enabled: e.target.checked })}
                                className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                            />
                            <span className="text-white font-black">تفعيل النسخ التلقائي</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="auto-backup-frequency" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">التكرار</label>
                        <select
                            id="auto-backup-frequency"
                            value={autoBackup.frequency}
                            onChange={(e) => setAutoBackup({ ...autoBackup, frequency: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={!autoBackup.enabled}
                        >
                            {frequencies.map(freq => (
                                <option key={freq.value} value={freq.value}>{freq.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="auto-backup-time" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الوقت</label>
                        <input
                            id="auto-backup-time"
                            type="time"
                            value={autoBackup.time}
                            onChange={(e) => setAutoBackup({ ...autoBackup, time: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={!autoBackup.enabled}
                        />
                    </div>
                    <div>
                        <label htmlFor="auto-backup-retention" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الاحتفاظ بالنسخ (أيام)</label>
                        <input
                            id="auto-backup-retention"
                            type="number"
                            value={autoBackup.retention}
                            onChange={(e) => setAutoBackup({ ...autoBackup, retention: Number.parseInt(e.target.value, 10) })}
                            min="7"
                            max="365"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={!autoBackup.enabled}
                        />
                    </div>
                </div>
            </div>

            {/* Create Backup Form */}
            <div className="glass-medium rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-black text-white mb-6">إنشاء نسخة احتياطي جديد</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label htmlFor="backup-type-select" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">نوع النسخة</label>
                        <select
                            id="backup-type-select"
                            value={backupType}
                            onChange={(e) => setBackupType(e.target.value as any)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            {backupTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label} - {type.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h3 className="font-black text-white mb-2">
                                {backupTypes.find(t => t.value === backupType)?.icon} {backupTypes.find(t => t.value === backupType)?.label}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {backupTypes.find(t => t.value === backupType)?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backups List */}
            <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-black text-white">النسخ الاحتياطي المتاحة</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الاسم</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">النوع</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحجم</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحالة</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">التاريخ</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backups.map((backup) => (
                                <tr key={backup.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-black text-white">{backup.name}</div>
                                            <div className="text-xs text-gray-400">{backup.description}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">{getTypeBadge(backup.type)}</td>
                                    <td className="p-4 text-white">{backup.size}</td>
                                    <td className="p-4">{getStatusBadge(backup.status)}</td>
                                    <td className="p-4 text-white">{new Date(backup.date).toLocaleDateString('ar-SY')}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => handleDownloadBackup(backup)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                title="تحميل"
                                            >
                                                📥
                                            </button>
                                            <button
                                                onClick={() => handleRestoreBackup(backup)}
                                                className="p-2 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
                                                title="استعادة"
                                                disabled={backup.status !== 'completed'}
                                            >
                                                🔄
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBackup(backup.id)}
                                                className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                                title="حذف"
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

            {/* Storage Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">مساحة التخزين المستخدمة</p>
                            <p className="text-2xl font-black text-white">69.7 MB</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">💾</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">عدد النسخ الاحتياطي</p>
                            <p className="text-2xl font-black text-white">{backups.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">آخر نسخة احتياطي</p>
                            <p className="text-2xl font-black text-white">
                                {backups.length > 0 ? new Date(backups[0].date).toLocaleDateString('ar-SY') : 'لا يوجد'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restore Modal */}
            {showRestoreModal && selectedBackup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-medium rounded-3xl border border-white/10 max-w-md w-full p-8">
                        <h2 className="text-2xl font-black text-white mb-4">استعادة النسخة الاحتياطية</h2>
                        <div className="space-y-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <h3 className="font-black text-white mb-2">{selectedBackup.name}</h3>
                                <div className="text-sm text-gray-400 space-y-1">
                                    <div>الحجم: {selectedBackup.size}</div>
                                    <div>التاريخ: {new Date(selectedBackup.date).toLocaleDateString('ar-SY')}</div>
                                    <div>النوع: {backupTypes.find(t => t.value === selectedBackup.type)?.label}</div>
                                </div>
                            </div>
                            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    ⚠️
                                    <div className="text-amber-400 text-sm">
                                        <p className="font-black">تحذير:</p>
                                        <p>استعادة النسخة الاحتياطية سيستبدل البيانات الحالية بالبيانات الموجودة في النسخة.</p>
                                        <p>يرجى التأكد من أنك تريد استعادة هذه النسخة.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowRestoreModal(false)}
                                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmRestore}
                                className="px-6 py-3 bg-amber-500 text-gray-900 font-black rounded-xl hover:bg-amber-400 transition-colors"
                            >
                                استعادة النسخة
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.backup}
            />
        </div>
    );
};

export default BackupPage;
