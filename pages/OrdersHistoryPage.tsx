
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockOrders } from '../constants';
import OrderCard from '../components/OrderCard';
import { Page } from '../App';

interface OrdersHistoryPageProps {
    setPage: (page: Page) => void;
}

const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({ setPage }) => {
    const { user } = useAuth();

    if (!user) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">يرجى تسجيل الدخول لعرض سجل طلباتك.</h2>
          </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-8">سجل الطلبات</h1>
            {mockOrders.length > 0 ? (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {mockOrders.map((order) => (
                        <OrderCard key={order.id} order={order} setPage={setPage} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl">
                    <h2 className="text-2xl font-bold">لا يوجد طلبات سابقة.</h2>
                    <p className="text-gray-300 mt-4">عندما تقوم بأول طلب، سيظهر هنا.</p>
                </div>
            )}
        </div>
    );
};

export default OrdersHistoryPage;
