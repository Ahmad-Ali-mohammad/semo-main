import React, { useState } from 'react';
import { SearchIcon, EditIcon, TrashIcon, MailIcon } from '../../components/icons';
import { useDatabase } from '../../contexts/DatabaseContext';
import { User } from '../../types';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const CustomersManagementPage: React.FC = () => {
    const { users, orders } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getCustomerStats = (userId: string) => {
        const customerOrders = orders.filter(order => order.userId === userId);
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
        const orderCount = customerOrders.length;
        const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return { totalSpent, orderCount, lastOrder };
    };

    const handleDeleteCustomer = (userId: string) => {
        if (globalThis.confirm('هل أنت متأكد من حذف هذا العميل؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            // In a real app, this would call an API
            console.log('Delete customer:', userId);
            globalThis.alert('تم حذف العميل بنجاح');
        }
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        // In a real app, this would call an API
        console.log('Change role:', userId, 'to', newRole);
        globalThis.alert('تم تحديث دور العميل بنجاح');
    };

    const getRoleBadgeClass = (role: string): string => {
        if (role === 'admin') return 'bg-red-500/20 text-red-400';
        if (role === 'manager') return 'bg-amber-500/20 text-amber-400';
        return 'bg-green-500/20 text-green-400';
    };

    const getRoleLabel = (role: string): string => {
        if (role === 'admin') return 'مدير';
        if (role === 'manager') return 'مشرف';
        return 'عميل';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">إدارة العملاء</h1>
                        <p className="text-gray-400">عرض وإدارة جميع عملاء المتجر</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="البحث عن عميل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
                        />
                    </div>
                    <select
                        id="customer-role-filter"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        aria-label="تصفية العملاء حسب الدور"
                    >
                        <option value="all">جميع الأدوار</option>
                        <option value="user">عملاء</option>
                        <option value="admin">مديرون</option>
                        <option value="manager">مشرفون</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">إجمالي العملاء</p>
                            <p className="text-2xl font-black text-white">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">العملاء النشطون</p>
                            <p className="text-2xl font-black text-white">
                                {users.filter(u => getCustomerStats(u.id).orderCount > 0).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📈</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">عملاء جدد</p>
                            <p className="text-2xl font-black text-white">
                                {users.filter(u => getCustomerStats(u.id).orderCount === 0).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🆕</span>
                        </div>
                    </div>
                </div>
                <div className="glass-medium rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">متوسط الإنفاق</p>
                            <p className="text-2xl font-black text-white">
                                ${users.length > 0 ? Math.round(users.reduce((sum, u) => sum + getCustomerStats(u.id).totalSpent, 0) / users.length) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">العميل</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الدور</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الطلبات</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">إجمالي الإنفاق</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">آخر طلب</th>
                                <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const stats = getCustomerStats(user.id);
                                return (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white">{stats.orderCount}</td>
                                        <td className="p-4 text-amber-400 font-black">${stats.totalSpent.toFixed(2)}</td>
                                        <td className="p-4 text-gray-300">
                                            {stats.lastOrder ? new Date(stats.lastOrder.date).toLocaleDateString('ar-SY') : 'لا يوجد'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => { setSelectedCustomer(user); setShowDetails(true); }}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                    title="عرض التفاصيل"
                                                >
                                                    👁
                                                </button>
                                                <button
                                                    onClick={() => handleRoleChange(user.id, user.role === 'user' ? 'manager' : 'user')}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                    title="تغيير الدور"
                                                >
                                                    <EditIcon className="w-4 h-4 text-gray-400" />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteCustomer(user.id)}
                                                        className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                                        title="حذف العميل"
                                                    >
                                                        <TrashIcon className="w-4 h-4 text-red-400" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Details Modal */}
            {showDetails && selectedCustomer && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-medium rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-white text-2xl">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{selectedCustomer.name}</h2>
                                        <p className="text-gray-400">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <h3 className="text-lg font-black text-amber-400 mb-4">معلومات الحساب</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">الدور:</span>
                                                <span className="text-white font-black">
                                                    {getRoleLabel(selectedCustomer.role)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">تاريخ التسجيل:</span>
                                                <span className="text-white font-black">15 يناير 2024</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">الحالة:</span>
                                                <span className="text-green-400 font-black">نشط</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <h3 className="text-lg font-black text-amber-400 mb-4">إحصائيات المشتريات</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">عدد الطلبات:</span>
                                                <span className="text-white font-black">{getCustomerStats(selectedCustomer.id).orderCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">إجمالي الإنفاق:</span>
                                                <span className="text-amber-400 font-black">${getCustomerStats(selectedCustomer.id).totalSpent.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">متوسط الطلب:</span>
                                                <span className="text-white font-black">
                                                    ${getCustomerStats(selectedCustomer.id).orderCount > 0
                                                        ? (getCustomerStats(selectedCustomer.id).totalSpent / getCustomerStats(selectedCustomer.id).orderCount).toFixed(2)
                                                        : '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-black text-amber-400 mb-4">الطلبات الأخيرة</h3>
                                    <div className="space-y-3">
                                        {orders
                                            .filter(order => order.userId === selectedCustomer.id)
                                            .slice(0, 5)
                                            .map(order => (
                                                <div key={order.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                    <div>
                                                        <div className="font-black text-white">طلب #{order.id}</div>
                                                        <div className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString('ar-SY')}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-amber-400 font-black">${order.total.toFixed(2)}</div>
                                                        <div className="text-sm text-gray-400">{order.status}</div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                                >
                                    إغلاق
                                </button>
                                <button
                                    onClick={() => globalThis.open(`mailto:${selectedCustomer.email}`)}
                                    className="px-6 py-3 bg-amber-500 text-gray-900 font-black rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
                                >
                                    <MailIcon className="w-4 h-4" />
                                    إرسال بريد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.customers}
            />
        </div>
    );
};

export default CustomersManagementPage;
