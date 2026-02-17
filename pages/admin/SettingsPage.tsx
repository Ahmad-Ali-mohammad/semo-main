import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        storeName: 'بيت الزواحف',
        storeEmail: 'info@reptilehouse.sy',
        storePhone: '+963 993 595 766',
        storeAddress: 'Bchamoun Village 5-7, Bchamoun, Lebanon',
        storeCurrency: 'USD',
        storeLanguage: 'ar',
        enableNotifications: true,
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        maintenanceMode: false,
        allowGuestCheckout: false,
        requireEmailVerification: true,
        defaultUserRole: 'user',
        taxRate: 10,
        shippingFee: 15,
        freeShippingThreshold: 100,
        socialLinks: {
            facebook: 'https://www.facebook.com/share/1EupNJpz48/',
            instagram: 'https://www.instagram.com/reptile_hou',
            twitter: '',
            youtube: ''
        },
        theme: {
            primaryColor: '#f59e0b',
            secondaryColor: '#6366f1',
            darkMode: true
        }
    });

    const tabs = [
        { id: 'general', label: 'إعدادات عامة', icon: '⚙️' },
        { id: 'store', label: 'المتجر', icon: '🏪' },
        { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
        { id: 'security', label: 'الأمان', icon: '🔒' },
        { id: 'appearance', label: 'المظهر', icon: '🎨' }
    ];

    const handleSave = () => {
        // في التطبيق الفعلي تُحفظ الإعدادات عبر الواجهة البرمجية
        console.log('Saving settings:', settings);
        alert('تم حفظ الإعدادات بنجاح');
    };

    const handleReset = () => {
        if (globalThis.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
            // Reset to defaults
            setSettings({
                storeName: 'بيت الزواحف',
                storeEmail: 'info@reptilehouse.sy',
                storePhone: '+963 993 595 766',
                storeAddress: 'Bchamoun Village 5-7, Bchamoun, Lebanon',
                storeCurrency: 'USD',
                storeLanguage: 'ar',
                enableNotifications: true,
                enableEmailNotifications: true,
                enableSmsNotifications: false,
                maintenanceMode: false,
                allowGuestCheckout: false,
                requireEmailVerification: true,
                defaultUserRole: 'user',
                taxRate: 10,
                shippingFee: 15,
                freeShippingThreshold: 100,
                socialLinks: {
                    facebook: 'https://www.facebook.com/share/1EupNJpz48/',
                    instagram: 'https://www.instagram.com/reptile_hou',
                    twitter: '',
                    youtube: ''
                },
                theme: {
                    primaryColor: '#f59e0b',
                    secondaryColor: '#6366f1',
                    darkMode: true
                }
            });
            alert('تم إعادة تعيين الإعدادات');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="store-name" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">اسم المتجر</label>
                                <input
                                    id="store-name"
                                    type="text"
                                    value={settings.storeName}
                                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="store-email" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
                                <input
                                    id="store-email"
                                    type="email"
                                    value={settings.storeEmail}
                                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="store-phone" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">رقم الهاتف</label>
                                <input
                                    id="store-phone"
                                    type="tel"
                                    value={settings.storePhone}
                                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="store-address" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">العنوان</label>
                                <textarea
                                    id="store-address"
                                    value={settings.storeAddress}
                                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="store-currency" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">العملة الافتراضية</label>
                                <select
                                    id="store-currency"
                                    value={settings.storeCurrency}
                                    onChange={(e) => setSettings({ ...settings, storeCurrency: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="USD">دولار أمريكي (USD)</option>
                                    <option value="EUR">يورو (EUR)</option>
                                    <option value="SYP">ليرة سورية (SYP)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="store-language" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">اللغة الافتراضية</label>
                                <select
                                    id="store-language"
                                    value={settings.storeLanguage}
                                    onChange={(e) => setSettings({ ...settings, storeLanguage: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="ar">العربية</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'store':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="tax-rate" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">ضريبة الضريبة (%)</label>
                                <input
                                    id="tax-rate"
                                    type="number"
                                    value={settings.taxRate}
                                    onChange={(e) => setSettings({ ...settings, taxRate: Number.parseFloat(e.target.value) })}
                                    min="0"
                                    max="100"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="shipping-fee" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">رسوم الشحن</label>
                                <input
                                    id="shipping-fee"
                                    type="number"
                                    value={settings.shippingFee}
                                    onChange={(e) => setSettings({ ...settings, shippingFee: Number.parseFloat(e.target.value) })}
                                    min="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="free-shipping" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الشحن المجاني (حد أدنى)</label>
                                <input
                                    id="free-shipping"
                                    type="number"
                                    value={settings.freeShippingThreshold}
                                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number.parseFloat(e.target.value) })}
                                    min="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="default-role" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الدور الافتراضي للمستخدمين الجدد</label>
                                <select
                                    id="default-role"
                                    value={settings.defaultUserRole}
                                    onChange={(e) => setSettings({ ...settings, defaultUserRole: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="user">عميل</option>
                                    <option value="manager">مشرف</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-amber-400 mb-4">روابط التواصل الاجتماعي</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="facebook-url" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">فيسبوك</label>
                                    <input
                                        id="facebook-url"
                                        type="url"
                                        value={settings.socialLinks.facebook}
                                        onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="instagram-url" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">انستغرام</label>
                                    <input
                                        id="instagram-url"
                                        type="url"
                                        value={settings.socialLinks.instagram}
                                        onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="twitter-url" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">تويتر</label>
                                    <input
                                        id="twitter-url"
                                        type="url"
                                        value={settings.socialLinks.twitter}
                                        onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="youtube-url" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">يوتيوب</label>
                                    <input
                                        id="youtube-url"
                                        type="url"
                                        value={settings.socialLinks.youtube}
                                        onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-amber-400 mb-4">إعدادات الإشعارات</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.enableNotifications}
                                        onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                                        className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="text-white">تفعيل الإشعارات العامة</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.enableEmailNotifications}
                                        onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                                        className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="text-white">إشعارات البريد الإلكتروني</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.enableSmsNotifications}
                                        onChange={(e) => setSettings({ ...settings, enableSmsNotifications: e.target.checked })}
                                        className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="text-white">إشعارات الرسائل النصية</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-amber-400 mb-4">إعدادات الأمان</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.requireEmailVerification}
                                        onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                                        className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="text-white">تطلب التحقق من البريد الإلكتروني</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!settings.allowGuestCheckout}
                                        onChange={(e) => setSettings({ ...settings, allowGuestCheckout: !e.target.checked })}
                                        className="w-5 h-5 bg-amber-500 rounded text-gray-900 focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="text-white">تسجيل الدخول مطلوب للشراء</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                        className="w-5 h-5 bg-red-500 rounded text-white focus:ring-2 focus:ring-red-500"
                                    />
                                    <span className="text-white">وضع الصيانة</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-amber-400 mb-4">المظهر</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="primary-color" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">اللون الأساسي</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="primary-color"
                                                type="color"
                                                value={settings.theme.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                                                className="w-12 h-12 rounded-xl border border-white/10"
                                                aria-label="اختر اللون الأساسي"
                                            />
                                            <input
                                                type="text"
                                                value={settings.theme.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                aria-label="كود اللون الأساسي"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="secondary-color" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">اللون الثانوي</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="secondary-color"
                                                type="color"
                                                value={settings.theme.secondaryColor}
                                                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })}
                                                className="w-12 h-12 rounded-xl border border-white/10"
                                                aria-label="اختر اللون الثانوي"
                                            />
                                            <input
                                                type="text"
                                                value={settings.theme.secondaryColor}
                                                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                aria-label="كود اللون الثانوي"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="theme-mode" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الوضع</label>
                                        <select
                                            id="theme-mode"
                                            value={settings.theme.darkMode ? 'dark' : 'light'}
                                            onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, darkMode: e.target.value === 'dark' } })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="dark">داكن</option>
                                            <option value="light">فاتح</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">الإعدادات</h1>
                    <p className="text-gray-400">إدارة إعدادات المتجر والنظام</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="glass-light border border-white/10 text-white font-black px-6 py-3 rounded-2xl hover:bg-white/10 transition-all"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-amber-500 text-gray-900 font-black px-6 py-3 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
                    >
                        💾
                        حفظ التغييرات
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id
                            ? 'bg-amber-500 text-gray-900'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                            }`}
                    >
                        <span className="ml-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="glass-medium rounded-2xl border border-white/10 p-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SettingsPage;
