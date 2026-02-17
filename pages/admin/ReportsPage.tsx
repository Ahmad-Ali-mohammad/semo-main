import React, { useState } from 'react';
import { SearchIcon, FilterIcon, PackageIcon, UserIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const ReportsPage: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('sales');
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const periods = [
        { value: 'today', label: 'اليوم' },
        { value: 'week', label: 'الأسبوع' },
        { value: 'month', label: 'الشهر' },
        { value: 'quarter', label: 'الربع' },
        { value: 'year', label: 'السنة' }
    ];

    const reportTypes = [
        { value: 'sales', label: 'تقرير المبيعات', icon: '💰' },
        { value: 'products', label: 'تقرير المنتجات', icon: '📦' },
        { value: 'customers', label: 'تقرير العملاء', icon: '👥' },
        { value: 'orders', label: 'تقرير الطلبات', icon: '📋' },
        { value: 'inventory', label: 'تقرير المخزون', icon: '📊' },
        { value: 'financial', label: 'التقرير المالي', icon: '💳' },
        { value: 'marketing', label: 'التقرير التسويقي', icon: '📢' },
        { value: 'performance', label: 'تقرير الأداء', icon: '⚡' }
    ];

    const generateSalesData = () => [
        { date: '2024-01-01', sales: 1250, orders: 12, customers: 8 },
        { date: '2024-01-02', sales: 2100, orders: 18, customers: 15 },
        { date: '2024-01-03', sales: 1800, orders: 15, customers: 12 },
        { date: '2024-01-04', sales: 3200, orders: 28, customers: 22 },
        { date: '2024-01-05', sales: 2800, orders: 24, customers: 19 },
        { date: '2024-01-06', sales: 1500, orders: 13, customers: 10 },
        { date: '2024-01-07', sales: 2200, orders: 19, customers: 16 }
    ];

    const generateProductData = () => [
        { name: 'ثعبان البواء', sold: 45, revenue: 13500, stock: 12 },
        { name: 'سحلية اليمن', sold: 38, revenue: 11400, stock: 8 },
        { name: 'سلحفاة النيل', sold: 22, revenue: 6600, stock: 15 },
        { name: 'ضفدع الشجرة', sold: 56, revenue: 8400, stock: 20 },
        { name: 'أفعى كوبرا', sold: 8, revenue: 8000, stock: 2 }
    ];

    const generateCustomerData = () => [
        { name: 'أحمد محمد', orders: 5, totalSpent: 2500, lastOrder: '2024-01-15', joined: '2024-01-01' },
        { name: 'فاطمة علي', orders: 3, totalSpent: 1800, lastOrder: '2024-01-10', joined: '2024-01-05' },
        { name: 'محمد خالد', orders: 8, totalSpent: 4200, lastOrder: '2024-01-20', joined: '2023-12-15' },
        { name: 'نورا حسن', orders: 2, totalSpent: 1200, lastOrder: '2024-01-08', joined: '2024-01-10' },
        { name: 'عمر سعيد', orders: 6, totalSpent: 3100, lastOrder: '2024-01-18', joined: '2023-11-20' }
    ];

    const renderSalesReport = () => {
        const salesData = generateSalesData();
        const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
        const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
        const avgOrderValue = totalSales / totalOrders;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي المبيعات</p>
                                <p className="text-2xl font-black text-white">${totalSales.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                💰
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">عدد الطلبات</p>
                                <p className="text-2xl font-black text-white">{totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <PackageIcon className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">متوسط الطلب</p>
                                <p className="text-2xl font-black text-white">${avgOrderValue.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                📈
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">العملاء الجدد</p>
                                <p className="text-2xl font-black text-white">{salesData.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                👤
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">تفاصيل المبيعات اليومية</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">التاريخ</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المبيعات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الطلبات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">العملاء</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">متوسط الطلب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((day, index) => (
                                    <tr key={day.date} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white">{new Date(day.date).toLocaleDateString('ar-SY')}</td>
                                        <td className="p-4 text-amber-400 font-black">${day.sales.toLocaleString()}</td>
                                        <td className="p-4 text-white">{day.orders}</td>
                                        <td className="p-4 text-white">{day.customers}</td>
                                        <td className="p-4 text-white">${(day.sales / day.orders).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductsReport = () => {
        const productData = generateProductData();
        const totalSold = productData.reduce((sum, product) => sum + product.sold, 0);
        const totalRevenue = productData.reduce((sum, product) => sum + product.revenue, 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي المبيعات</p>
                                <p className="text-2xl font-black text-white">{totalSold}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <PackageIcon className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
                                <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">متوسط السعر</p>
                                <p className="text-2xl font-black text-white">${(totalRevenue / totalSold).toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">أداء المنتجات</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المنتج</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المبيعات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإيرادات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المخزون</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((product, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{product.name}</td>
                                        <td className="p-4 text-white">{product.sold}</td>
                                        <td className="p-4 text-amber-400 font-black">${product.revenue.toLocaleString()}</td>
                                        <td className="p-4 text-white">{product.stock}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-black ${product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                                                product.stock > 5 ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {product.stock > 10 ? 'متوفر' : product.stock > 5 ? 'محدود' : 'نادر'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderCustomersReport = () => {
        const customerData = generateCustomerData();
        const totalCustomers = customerData.length;
        const totalSpent = customerData.reduce((sum, customer) => sum + customer.totalSpent, 0);
        const avgSpent = totalSpent / totalCustomers;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي العملاء</p>
                                <p className="text-2xl font-black text-white">{totalCustomers}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الإنفاق</p>
                                <p className="text-2xl font-black text-white">${totalSpent.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">متوسط الإنفاق</p>
                                <p className="text-2xl font-black text-white">${avgSpent.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">متوسط الطلبات</p>
                                <p className="text-2xl font-black text-white">
                                    {(customerData.reduce((sum, c) => sum + c.orders, 0) / totalCustomers).toFixed(1)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <PackageIcon className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">أفضل العملاء</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">العميل</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الطلبات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإجمالي</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">آخر طلب</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">انضم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((customer, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{customer.name}</td>
                                        <td className="p-4 text-white">{customer.orders}</td>
                                        <td className="p-4 text-amber-400 font-black">${customer.totalSpent.toLocaleString()}</td>
                                        <td className="p-4 text-white">{new Date(customer.lastOrder).toLocaleDateString('ar-SY')}</td>
                                        <td className="p-4 text-white">{new Date(customer.joined).toLocaleDateString('ar-SY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrdersReport = () => {
        const ordersData = [
            { id: 'RH-1001', customer: 'فاطمة علي', date: '2024-02-01', total: 450, status: 'مكتمل', items: 3 },
            { id: 'RH-1002', customer: 'محمد خالد', date: '2024-02-03', total: 350, status: 'قيد التجهيز', items: 2 },
            { id: 'RH-1003', customer: 'نورا حسن', date: '2024-02-02', total: 250, status: 'قيد الشحن', items: 1 },
            { id: 'RH-1004', customer: 'أحمد محمد', date: '2024-02-04', total: 800, status: 'جديد', items: 4 },
            { id: 'RH-1005', customer: 'ليلى أحمد', date: '2024-02-05', total: 550, status: 'قيد التجهيز', items: 2 }
        ];

        const statusCounts = ordersData.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الطلبات</p>
                                <p className="text-2xl font-black text-white">{ordersData.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <PackageIcon className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">مكتملة</p>
                                <p className="text-2xl font-black text-white">{statusCounts['مكتمل'] || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">قيد التجهيز</p>
                                <p className="text-2xl font-black text-white">{statusCounts['قيد التجهيز'] || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">قيد الشحن</p>
                                <p className="text-2xl font-black text-white">{statusCounts['قيد الشحن'] || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🚚</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">تفاصيل الطلبات</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">رقم الطلب</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">العميل</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">التاريخ</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإجمالي</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المنتجات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersData.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{order.id}</td>
                                        <td className="p-4 text-white">{order.customer}</td>
                                        <td className="p-4 text-white">{new Date(order.date).toLocaleDateString('ar-SY')}</td>
                                        <td className="p-4 text-amber-400 font-black">${order.total.toLocaleString()}</td>
                                        <td className="p-4 text-white">{order.items}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${order.status === 'مكتمل' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'قيد التجهيز' ? 'bg-amber-500/20 text-amber-400' :
                                                    order.status === 'قيد الشحن' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderInventoryReport = () => {
        const inventoryData = [
            { name: 'ثعبان البواء', category: 'ثعابين', stock: 12, minStock: 5, maxStock: 20, value: 3600, turnover: 3.5 },
            { name: 'سحلية اليمن', category: 'سحاليب', stock: 8, minStock: 3, maxStock: 15, value: 1200, turnover: 4.2 },
            { name: 'سلحفاة النيل', category: 'سلاحف', stock: 15, minStock: 5, maxStock: 25, value: 1200, turnover: 2.8 },
            { name: 'ضفدع الشجرة', category: 'برمائيات', stock: 20, minStock: 10, maxStock: 30, value: 900, turnover: 5.1 },
            { name: 'أفعى كوبرا', category: 'ثعابين', stock: 2, minStock: 1, maxStock: 5, value: 1000, turnover: 1.2 }
        ];

        const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
        const lowStockItems = inventoryData.filter(item => item.stock <= item.minStock);
        const highTurnoverItems = inventoryData.filter(item => item.turnover >= 4);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">قيمة المخزون</p>
                                <p className="text-2xl font-black text-white">${totalValue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">مخزون منخفض</p>
                                <p className="text-2xl font-black text-white">{lowStockItems.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">دوران سريع</p>
                                <p className="text-2xl font-black text-white">{highTurnoverItems.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الأنواع</p>
                                <p className="text-2xl font-black text-white">{inventoryData.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">تحليل المخزون</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المنتج</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الفئة</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المخزون</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">القيمة</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الدوران</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{item.name}</td>
                                        <td className="p-4 text-white">{item.category}</td>
                                        <td className="p-4 text-white">{item.stock}</td>
                                        <td className="p-4 text-amber-400 font-black">${item.value.toLocaleString()}</td>
                                        <td className="p-4 text-white">{item.turnover}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${item.stock <= item.minStock ? 'bg-red-500/20 text-red-400' :
                                                item.stock >= item.maxStock ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-green-500/20 text-green-400'
                                                }`}>
                                                {item.stock <= item.minStock ? 'نقص' : item.stock >= item.maxStock ? 'فائض' : 'مثالي'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderFinancialReport = () => {
        const financialData = [
            { month: 'يناير', revenue: 15000, expenses: 8000, profit: 7000, orders: 45 },
            { month: 'فبراير', revenue: 18000, expenses: 9500, profit: 8500, orders: 52 },
            { month: 'مارس', revenue: 22000, expenses: 11000, profit: 11000, orders: 68 },
            { month: 'أبريل', revenue: 19000, expenses: 10000, profit: 9000, orders: 58 },
            { month: 'مايو', revenue: 25000, expenses: 12000, profit: 13000, orders: 75 },
            { month: 'يونيو', revenue: 28000, expenses: 13000, profit: 15000, orders: 82 }
        ];

        const totalRevenue = financialData.reduce((sum, item) => sum + item.revenue, 0);
        const totalExpenses = financialData.reduce((sum, item) => sum + item.expenses, 0);
        const totalProfit = financialData.reduce((sum, item) => sum + item.profit, 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
                                <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💵</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي المصاريف</p>
                                <p className="text-2xl font-black text-white">${totalExpenses.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💸</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">صافي الربح</p>
                                <p className="text-2xl font-black text-white">${totalProfit.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💎</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">هامش الربح</p>
                                <p className="text-2xl font-black text-white">{((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">التقرير المالي الشهري</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الشهر</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الإيرادات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المصاريف</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الربح</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الطلبات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financialData.map((item, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{item.month}</td>
                                        <td className="p-4 text-green-400 font-black">${item.revenue.toLocaleString()}</td>
                                        <td className="p-4 text-red-400 font-black">${item.expenses.toLocaleString()}</td>
                                        <td className="p-4 text-amber-400 font-black">${item.profit.toLocaleString()}</td>
                                        <td className="p-4 text-white">{item.orders}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderMarketingReport = () => {
        const marketingData = [
            { channel: 'الموقع الإلكتروني', visitors: 15000, conversions: 450, rate: 3.0, cost: 2000 },
            { channel: 'فيسبوك', visitors: 8000, conversions: 240, rate: 3.0, cost: 1500 },
            { channel: 'انستغرام', visitors: 12000, conversions: 360, rate: 3.0, cost: 1800 },
            { channel: 'جوجل', visitors: 5000, conversions: 200, rate: 4.0, cost: 2500 },
            { channel: 'توصيات', visitors: 3000, conversions: 150, rate: 5.0, cost: 500 }
        ];

        const totalVisitors = marketingData.reduce((sum, item) => sum + item.visitors, 0);
        const totalConversions = marketingData.reduce((sum, item) => sum + item.conversions, 0);
        const totalCost = marketingData.reduce((sum, item) => sum + item.cost, 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">إجمالي الزوار</p>
                                <p className="text-2xl font-black text-white">{totalVisitors.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">التحويلات</p>
                                <p className="text-2xl font-black text-white">{totalConversions.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">معدل التحويل</p>
                                <p className="text-2xl font-black text-white">{((totalConversions / totalVisitors) * 100).toFixed(1)}%</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">تكلفة التسويق</p>
                                <p className="text-2xl font-black text-white">${totalCost.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💳</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">قنوات التسويق</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">القناة</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">الزوار</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">التحويلات</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">المعدل</th>
                                    <th className="text-right p-4 text-gray-400 font-black text-sm uppercase tracking-widest">التكلفة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marketingData.map((item, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-black">{item.channel}</td>
                                        <td className="p-4 text-white">{item.visitors.toLocaleString()}</td>
                                        <td className="p-4 text-white">{item.conversions}</td>
                                        <td className="p-4 text-amber-400 font-black">{item.rate}%</td>
                                        <td className="p-4 text-white">${item.cost.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderPerformanceReport = () => {
        const performanceData = [
            { metric: 'سرعة الموقع', current: 2.3, target: 2.0, unit: 'ثانية', status: 'good' },
            { metric: 'وقت التحميل', current: 1.8, target: 2.0, unit: 'ثانية', status: 'excellent' },
            { metric: 'معدل الارتداد', current: 35, target: 40, unit: '%', status: 'good' },
            { metric: 'وقت الصفحة', current: 3.2, target: 3.0, unit: 'ثانية', status: 'warning' },
            { metric: 'توافر الخدمة', current: 99.5, target: 99.0, unit: '%', status: 'excellent' }
        ];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">متوسط الأداء</p>
                                <p className="text-2xl font-black text-white">85%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">أفضل أداء</p>
                                <p className="text-2xl font-black text-white">95%</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🏆</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-medium rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">يحتاج تحسين</p>
                                <p className="text-2xl font-black text-white">2</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🔧</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-medium rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-black text-white">مقاييس الأداء</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {performanceData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-black">{item.metric}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black ${item.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                            item.status === 'good' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {item.status === 'excellent' ? 'ممتاز' : item.status === 'good' ? 'جيد' : 'يحتاج تحسين'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-white/10 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${item.status === 'excellent' ? 'bg-green-500' :
                                                    item.status === 'good' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                    }`}
                                                style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-white text-sm">{item.current} {item.unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderReportContent = () => {
        switch (selectedReport) {
            case 'sales': return renderSalesReport();
            case 'products': return renderProductsReport();
            case 'customers': return renderCustomersReport();
            case 'orders': return renderOrdersReport();
            case 'inventory': return renderInventoryReport();
            case 'financial': return renderFinancialReport();
            case 'marketing': return renderMarketingReport();
            case 'performance': return renderPerformanceReport();
            default: return renderSalesReport();
        }
    };

    const exportReport = () => {
        alert('سيتم تصدير التقرير إلى ملف Excel');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">التقارير</h1>
                        <p className="text-gray-400">تحليل بيانات المتجر وإنشاء تقارير مفصلة</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <button
                    onClick={exportReport}
                    className="bg-amber-500 text-gray-900 font-black px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                    📥
                    تصدير التقرير
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                    {reportTypes.map(report => (
                        <button
                            key={report.value}
                            onClick={() => setSelectedReport(report.value)}
                            className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${selectedReport === report.value
                                ? 'bg-amber-500 text-gray-900'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                        >
                            <span className="ml-2">{report.icon}</span>
                            {report.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {periods.map(period => (
                        <button
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value)}
                            className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${selectedPeriod === period.value
                                ? 'bg-amber-500 text-gray-900'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            {/* Report Content */}
            {renderReportContent()}

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.reports}
            />
        </div>
    );
};

export default ReportsPage;
