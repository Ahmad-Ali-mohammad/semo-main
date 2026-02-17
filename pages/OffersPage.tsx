import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, CheckCircleIcon, ChevronRightIcon } from '../components/icons';
import { useCart } from '../hooks/useCart';
import { Page } from '../App';

interface OffersPageProps {
    setPage: (page: Page) => void;
}

const OffersPage: React.FC<OffersPageProps> = ({ setPage }) => {
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 37,
        seconds: 52
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                    if (minutes < 0) {
                        minutes = 59;
                        hours--;
                        if (hours < 0) {
                            hours = 23;
                            days--;
                            if (days < 0) {
                                clearInterval(timer);
                                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const packages = [
        {
            id: 'starter',
            title: 'باقة المبتدئين',
            description: 'كل ما تحتاجه لبدء تربية زاحفك الأول',
            originalPrice: 180,
            discountPrice: 149,
            discount: 17,
            items: [
                'زاحف صغير (اختيار من 3 أنواع)',
                'Terrarium بلاستيك 60x40x40 سم',
                'مصباح حرارة + لمبة UVB',
                'مخبئان + وعاء طعام',
                'دليل رعاية مطبوع'
            ],
            icon: '🐣',
            badge: 'الأكثر مبيعًا',
            popular: true
        },
        {
            id: 'intermediate',
            title: 'باقة المتوسطين',
            description: 'تجهيز احترافي لهواة الزواحف الجادين',
            originalPrice: 320,
            discountPrice: 259,
            discount: 19,
            items: [
                'زاحف متوسط (اختيار من 5 أنواع)',
                'Terrarium زجاجي 90x60x60 سم',
                'نظام حرارة ذكي',
                'إضاءة UVB + LED',
                'مجموعة ديكور طبيعي',
                'مجموعة أدوات تنظيف',
                'اشتراك 3 أشهر في طعام'
            ],
            icon: '🦎',
            badge: 'قيمة ممتازة'
        },
        {
            id: 'professional',
            title: 'باقة المحترفين',
            description: 'تجهيز كامل للمربين المحترفين والمعارض',
            originalPrice: 550,
            discountPrice: 399,
            discount: 27,
            items: [
                'زاحف نادر (اختيار من 8 أنواع)',
                'Terrarium خشبي مخصص 120x80x80 سم',
                'نظام بيئي متكامل',
                'إضاءة احترافية',
                'فلاتر وتوصيلات',
                'مجموعة نباتات طبيعية',
                'كاميرا مراقبة',
                'دورة تدريب متقدمة'
            ],
            icon: '👑',
            badge: 'محدود'
        }
    ];

    const handleAddToCart = (pkg: typeof packages[0]) => {
        addToCart({
            id: parseInt(pkg.id),
            name: pkg.title,
            price: pkg.discountPrice,
            imageUrl: '/assets/photo_2026-02-04_07-13-35.jpg',
            category: 'باقات',
            species: 'Package Deal',
            status: 'متوفر',
            rating: 4.9,
            description: pkg.description,
            quantity: 1
        });
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-block bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-pulse">
                    عرض محدود الوقت
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                    باقات<span className="text-amber-400"> الزواحف</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    احصل على كل ما تحتاجه في باقة واحدة بسعر مخفض. عروضنا محدودة وتنتهي قريبًا!
                </p>

                {/* Countdown Timer */}
                <div className="glass-medium rounded-2xl p-6 border border-white/10 inline-flex items-center gap-6 mb-8">
                    🕐
                    <div className="flex gap-4">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div className="text-3xl font-black text-white">{String(value).padStart(2, '0')}</div>
                                <div className="text-xs text-gray-400 uppercase">
                                    {unit === 'days' ? 'يوم' : unit === 'hours' ? 'ساعة' : unit === 'minutes' ? 'دقيقة' : 'ثانية'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {packages.map((pkg, index) => (
                    <div
                        key={pkg.id}
                        className={`glass-medium rounded-[3rem] border-2 p-8 transition-all hover:scale-105 hover:border-amber-500/50 relative overflow-hidden group ${pkg.popular ? 'border-amber-500 shadow-2xl shadow-amber-500/20' : 'border-white/10'
                            }`}
                    >
                        {pkg.badge && (
                            <div className="absolute top-4 right-4 bg-amber-500 text-gray-900 text-xs font-black px-3 py-1 rounded-full">
                                {pkg.badge}
                            </div>
                        )}

                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">{pkg.icon}</div>
                            <h3 className="text-2xl font-black mb-2 group-hover:text-amber-400 transition-colors">{pkg.title}</h3>
                            <p className="text-gray-400 text-sm">{pkg.description}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {pkg.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-gray-500 line-through text-lg">${pkg.originalPrice}</span>
                                <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                                    -{pkg.discount}%
                                </span>
                            </div>
                            <div className="text-4xl font-black text-amber-400">${pkg.discountPrice}</div>
                        </div>

                        <button
                            onClick={() => handleAddToCart(pkg)}
                            className="w-full bg-amber-500 text-gray-900 font-black py-4 px-6 rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 text-lg active:scale-95"
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                            أضف للسلة
                        </button>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <div className="glass-dark rounded-[3rem] p-12 border border-white/10 mb-16">
                <h2 className="text-3xl font-black text-center mb-12">لماذا تختار باقاتنا؟</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            💰
                        </div>
                        <h3 className="text-xl font-black mb-3">توفير يصل إلى 27%</h3>
                        <p className="text-gray-400">احصل على جميع المستلزمات بسعر أقل من شرائها منفصلة</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            🎯
                        </div>
                        <h3 className="text-xl font-black mb-3">مجموعات متوافقة</h3>
                        <p className="text-gray-400">جميع العناصر في الباقة مصممة لتعمل معًا بشكل مثالي</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            🛡️
                        </div>
                        <h3 className="text-xl font-black mb-3">ضمان الجودة</h3>
                        <p className="text-gray-400">جميع المنتجات في الباقات معتمدة ومضمونة من Reptile House</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h2 className="text-3xl font-black mb-4">لا تفوت هذه الفرصة!</h2>
                <p className="text-gray-300 mb-8">العروض تنتهي قريبًا. احصل على باقتك الآن قبل نفاد الكمية.</p>
                <button
                    onClick={() => setPage('showcase')}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-black px-12 py-4 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-3 text-lg mx-auto active:scale-95"
                >
                    استكشف جميع المنتجات
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default OffersPage;
