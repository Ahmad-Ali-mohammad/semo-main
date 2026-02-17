
import React from 'react';

const MASCOT_IMAGE_URL = "https://i.ibb.co/Lzr9P8P/reptile-house-mascot.jpg";

const services = [
    {
        id: 1,
        title: "فندقة الزواحف (Boarding)",
        description: "سافر وأنت مطمئن. نوفر بيئة مثالية لزاحفك مع رعاية غذائية وطبية يومية تحت إشراف خبرائنا في أقفاص معقمة ومجهزة.",
        icon: "🏨",
        price: "بدءاً من 20$ / ليلة",
        highlight: "الأكثر طلباً"
    },
    {
        id: 2,
        title: "تصميم وتنفيذ التيراريوم",
        description: "نصمم لك قطعة فنية من الطبيعة في منزلك. أحواض مخصصة تحاكي البيئة الأصلية لكل نوع بأحدث تقنيات الإضاءة والتهوية.",
        icon: "🎨",
        price: "حسب المقاس والنوع",
        highlight: "تصميم مخصص"
    },
    {
        id: 3,
        title: "الاستشارات الطبية والغذائية",
        description: "فحص دوري ونظام غذائي مخصص لضمان صحة وطول عمر حيوانك الأليف. نقدم استشاراتنا بإشراف مختصين في صحة الزواحف.",
        icon: "🩺",
        price: "25$ للجلسة الواحدة",
        highlight: "بإشراف مختصين"
    },
    {
        id: 4,
        title: "توصيل حيوي آمن للمحافظات",
        description: "خدمة توصيل احترافية تضمن الحفاظ على درجة الحرارة والرطوبة المناسبة أثناء النقل لضمان وصول حيوانك بدون إجهاد.",
        icon: "🚚",
        price: "حسب بعد المحافظة",
        highlight: "شحن آمن"
    }
];

const ServicesPage: React.FC = () => {
    return (
        <div className="space-y-20 animate-fade-in text-right">
            {/* Header section with background mascot */}
            <section className="relative h-[50vh] rounded-[4rem] overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl p-8">
                <img src={MASCOT_IMAGE_URL} alt="Services bg" className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
                <div className="relative z-10 max-w-4xl space-y-6">
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">خدماتنا الاحترافية</h1>
                    <p className="text-xl md:text-2xl text-amber-400/90 font-bold max-w-3xl mx-auto leading-relaxed">
                        نحن لا نبيع الزواحف فحسب، بل نبني بيئة متكاملة تضمن لك ولرفيقك الجديد حياة سعيدة ومستقرة بدم بارد.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {services.map(service => (
                    <div key={service.id} className="glass-medium p-12 rounded-[3.5rem] border border-white/10 hover:border-amber-500/50 transition-all duration-500 group shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] -z-10 group-hover:bg-amber-500/10 transition-all"></div>
                        
                        <div>
                            <div className="flex justify-between items-start mb-10">
                                <div className="text-7xl group-hover:scale-110 transition-transform duration-700">{service.icon}</div>
                                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {service.highlight}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-6 group-hover:text-amber-400 transition-colors">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-10">{service.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-8">
                            <div className="text-amber-500/80 font-black font-poppins text-lg tracking-widest uppercase">{service.price}</div>
                            <button className="bg-white/5 hover:bg-amber-500 hover:text-gray-900 border border-white/10 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95">
                                اطلب الخدمة
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section className="glass-dark rounded-[4rem] p-16 md:p-24 text-center border border-white/10 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                 <div className="relative z-10 space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-6">هل لديك متطلبات خاصة؟</h2>
                    <p className="text-gray-400 text-xl mb-12 max-w-3xl mx-auto leading-loose font-bold">
                        سواء كنت تبحث عن تصميم أحواض عملاقة للفنادق أو تحتاج لفحص شامل لمجموعة زواحف كبيرة، سيمون وفريقه جاهزون لتقديم الحلول الأنسب لك.
                    </p>
                    <button className="bg-amber-500 text-gray-900 font-black px-16 py-6 rounded-[2rem] hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 text-xl active:scale-95">
                        احجز موعد استشارة خاصة
                    </button>
                 </div>
            </section>
        </div>
    );
};

export default ServicesPage;
