
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const AnalyticsPage: React.FC = () => {
    const { orders, products } = useDatabase();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
    
    const categoriesCount = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black">التحليلات والإحصائيات</h1>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-medium p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-gray-400 font-bold mb-2">إجمالي الإيرادات</p>
                    <p className="text-5xl font-black text-amber-500 font-poppins">${totalRevenue.toLocaleString()}</p>
                    <div className="mt-4 text-xs text-green-400 font-bold">+12% منذ الشهر الماضي</div>
                </div>
                <div className="glass-medium p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-gray-400 font-bold mb-2">عدد الطلبات المكتملة</p>
                    <p className="text-5xl font-black text-white font-poppins">{totalOrders}</p>
                    <div className="mt-4 text-xs text-amber-400 font-bold">نمو مستقر</div>
                </div>
                <div className="glass-medium p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-gray-400 font-bold mb-2">متوسط قيمة الطلب</p>
                    <p className="text-5xl font-black text-indigo-400 font-poppins">${avgOrderValue}</p>
                    <div className="mt-4 text-xs text-gray-500 font-bold">بناءً على {totalOrders} طلب</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart Mockup */}
                <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10">
                    <h3 className="text-xl font-black mb-8">توزيع المنتجات حسب الفئة</h3>
                    <div className="space-y-6">
                        {Object.entries(categoriesCount).map(([cat, count]) => {
                            // Fix: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
                            const percentage = ((count as number) / products.length) * 100;
                            const label = cat === 'snake' ? 'ثعابين' : cat === 'lizard' ? 'سحالي' : 'سلاحف';
                            return (
                                <div key={cat} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-300">{label}</span>
                                        <span className="text-amber-500">{count} منتج ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${cat === 'snake' ? 'bg-amber-500' : cat === 'lizard' ? 'bg-indigo-500' : 'bg-green-500'}`} 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sales Performance Mockup */}
                <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10">
                    <h3 className="text-xl font-black mb-8">أداء المبيعات الشهري</h3>
                    <div className="flex items-end justify-between h-48 gap-2 pt-4">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div 
                                    className="w-full bg-amber-500/20 group-hover:bg-amber-500/40 border-x border-t border-amber-500/20 rounded-t-lg transition-all duration-500 relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-gray-900 text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${h * 100}
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold">الشهر {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.analytics}
            />
        </div>
    );
};

export default AnalyticsPage;
