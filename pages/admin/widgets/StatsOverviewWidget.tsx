import React, { useMemo } from 'react';
import { PackageIcon, ShoppingCartIcon, ClipboardListIcon } from '../../../components/icons';
import { useDatabase } from '../../../contexts/DatabaseContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center space-x-4 space-x-reverse">
        <div className="bg-amber-500/20 text-amber-300 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const StatsOverviewWidget: React.FC = () => {
    const { orders, products, supplies } = useDatabase();

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
        const availableProducts = products.filter(p => p.isAvailable).length;
        return [
            { title: 'إجمالي المبيعات', value: `${totalSales.toLocaleString('ar-SY')} ل.س`, icon: <ShoppingCartIcon className="w-6 h-6" /> },
            { title: 'إجمالي الطلبات', value: String(orders.length), icon: <ClipboardListIcon className="w-6 h-6" /> },
            { title: 'المستلزمات', value: String(supplies.length), icon: <PackageIcon className="w-6 h-6" /> },
            { title: 'المنتجات المتاحة', value: String(availableProducts), icon: <PackageIcon className="w-6 h-6" /> },
        ];
    }, [orders, products, supplies]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
    );
};

export default StatsOverviewWidget;