
import React, { useState, useEffect } from 'react';
import { CompanyInfo } from '../../types';
import { api } from '../../services/api';
import { EditIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const CompanyInfoManagementPage: React.FC = () => {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: '', nameEnglish: '', description: '', foundedYear: 0, mission: '', vision: '', story: '', logoUrl: '', mascotUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [editedInfo, setEditedInfo] = useState<CompanyInfo>(companyInfo);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isImageProcessing, setIsImageProcessing] = useState<{ logo: boolean; mascot: boolean }>({
        logo: false,
        mascot: false
    });

    useEffect(() => {
        api.getCompanyInfo().then((info) => {
            setCompanyInfo(info);
            setEditedInfo(info);
        }).catch(() => {});
    }, []);

    const handleImageChange = (type: 'logo' | 'mascot', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ø­Ø¬Ù… Ø§Ù„ØµÙˆØ±Ø© ÙƒØ¨ÙŠØ± Ø¬Ø¯Ø§Ù‹. Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('ÙŠØ±Ø¬Ù‰ Ø±ÙØ¹ ØµÙˆØ±Ø© ÙÙ‚Ø·');
            return;
        }

        setIsImageProcessing(prev => ({ ...prev, [type]: true }));
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'logo') {
                setEditedInfo(prev => ({ ...prev, logoUrl: reader.result as string }));
            } else {
                setEditedInfo(prev => ({ ...prev, mascotUrl: reader.result as string }));
            }
            setIsImageProcessing(prev => ({ ...prev, [type]: false }));
        };
        reader.onerror = () => {
            alert('ÙØ´Ù„ ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØµÙˆØ±Ø©. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.');
            setIsImageProcessing(prev => ({ ...prev, [type]: false }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!editedInfo.name || !editedInfo.nameEnglish || !editedInfo.description) {
            alert('ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©');
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            api.saveCompanyInfo(editedInfo).catch(() => {});
            setCompanyInfo(editedInfo);
            setIsEditing(false);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 500);
    };

    const handleCancel = () => {
        setEditedInfo(companyInfo);
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="animate-fade-in relative space-y-8 text-right">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ©</h1>
                        <p className="text-gray-400">Ø¥Ø¯Ø§Ø±Ø© Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ© ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©</p>
                    </div>
                    <div className="flex gap-3">
                        <HelpButton onClick={() => setIsHelpOpen(true)} />
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                        >
                            <EditIcon className="w-5 h-5" />
                            <span>ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª</span>
                        </button>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø£Ø³Ø§Ø³ÙŠØ©</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</p>
                                <p className="text-white font-bold text-lg">{companyInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©</p>
                                <p className="text-white font-bold text-lg font-poppins">{companyInfo.nameEnglish}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø³Ù†Ø© Ø§Ù„ØªØ£Ø³ÙŠØ³</p>
                                <p className="text-white font-bold text-lg font-poppins">{companyInfo.foundedYear}</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">Ø§Ù„ØµÙˆØ± ÙˆØ§Ù„Ø´Ø¹Ø§Ø±Ø§Øª</h3>
                        <div className="space-y-4">
                            {companyInfo.logoUrl && (
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">Ø§Ù„Ø´Ø¹Ø§Ø± (Logo)</p>
                                    <img src={companyInfo.logoUrl} alt="Logo" className="w-32 h-32 object-contain bg-white/5 rounded-xl p-4" />
                                </div>
                            )}
                            {companyInfo.mascotUrl && (
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">Ø§Ù„Ù…Ø§Ø³ÙƒÙˆØª</p>
                                    <img src={companyInfo.mascotUrl} alt="Mascot" className="w-full h-40 object-cover rounded-xl" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Width Cards */}
                <div className="space-y-6">
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">ÙˆØµÙ Ø§Ù„Ø´Ø±ÙƒØ©</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.description}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">Ø§Ù„Ø±Ø³Ø§Ù„Ø©</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.mission}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">Ø§Ù„Ø±Ø¤ÙŠØ©</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.vision}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">Ù‚ØµØªÙ†Ø§</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.story}</p>
                    </div>
                </div>

                {/* Help Modal */}
                <HelpModal
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                    title={helpContent.company_info.title}
                    sections={helpContent.company_info.sections}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">ØªØ¹Ø¯ÙŠÙ„ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ©</h1>
                    <p className="text-gray-400">Ù‚Ù… Ø¨ØªØ­Ø¯ÙŠØ« Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ© ÙˆØ­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>

            {showSuccess && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in z-50">
                    <div className="flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6" />
                        <p className="font-bold">ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø¨Ù†Ø¬Ø§Ø­!</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø£Ø³Ø§Ø³ÙŠØ©</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="company-name-ar" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ© (Ø¹Ø±Ø¨ÙŠ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="company-name-ar"
                                type="text"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.name}
                                onChange={e => setEditedInfo({ ...editedInfo, name: e.target.value })}
                                placeholder="Ø¨ÙŠØª Ø§Ù„Ø²ÙˆØ§Ø­Ù"
                            />
                        </div>
                        <div>
                            <label htmlFor="company-name-en" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ© (Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="company-name-en"
                                type="text"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.nameEnglish}
                                onChange={e => setEditedInfo({ ...editedInfo, nameEnglish: e.target.value })}
                                placeholder="Reptile House"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="company-founded-year" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø³Ù†Ø© Ø§Ù„ØªØ£Ø³ÙŠØ³
                            </label>
                            <input
                                id="company-founded-year"
                                type="number"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.foundedYear}
                                onChange={e => setEditedInfo({ ...editedInfo, foundedYear: Number(e.target.value) })}
                                placeholder="2020"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">Ø§Ù„ØµÙˆØ± ÙˆØ§Ù„Ø´Ø¹Ø§Ø±Ø§Øª</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo */}
                        <div>
                            <label htmlFor="company-logo-upload" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø´Ø¹Ø§Ø± Ø§Ù„Ø´Ø±ÙƒØ© (Logo)
                            </label>
                            <div className="relative">
                                {editedInfo.logoUrl ? (
                                    <div className="relative w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                        <img src={editedInfo.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                        {isImageProcessing.logo && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">Ù„Ø§ ØªÙˆØ¬Ø¯ ØµÙˆØ±Ø©</p>
                                    </div>
                                )}
                                <input
                                    id="company-logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleImageChange('logo', e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Ø±ÙØ¹ Ø´Ø¹Ø§Ø± Ø§Ù„Ø´Ø±ÙƒØ©"
                                />
                            </div>
                        </div>

                        {/* Mascot */}
                        <div>
                            <label htmlFor="company-mascot-upload" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ù„Ù…Ø§Ø³ÙƒÙˆØª
                            </label>
                            <div className="relative">
                                {editedInfo.mascotUrl ? (
                                    <div className="relative w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                        <img src={editedInfo.mascotUrl} alt="Mascot" className="w-full h-full object-cover" />
                                        {isImageProcessing.mascot && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">Ù„Ø§ ØªÙˆØ¬Ø¯ ØµÙˆØ±Ø©</p>
                                    </div>
                                )}
                                <input
                                    id="company-mascot-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleImageChange('mascot', e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ù…Ø§Ø³ÙƒÙˆØª"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Fields */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">Ø§Ù„Ù†ØµÙˆØµ ÙˆØ§Ù„Ù…Ø­ØªÙˆÙ‰</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="company-description" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                ÙˆØµÙ Ø§Ù„Ø´Ø±ÙƒØ© <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="company-description"
                                required
                                rows={3}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.description}
                                onChange={e => setEditedInfo({ ...editedInfo, description: e.target.value })}
                                placeholder="Ù†Ø­Ù† Ø£ÙƒØ«Ø± Ù…Ù† Ù…Ø¬Ø±Ø¯ Ù…ØªØ¬Ø±..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-mission" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø±Ø³Ø§Ù„ØªÙ†Ø§
                            </label>
                            <textarea
                                id="company-mission"
                                rows={4}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.mission}
                                onChange={e => setEditedInfo({ ...editedInfo, mission: e.target.value })}
                                placeholder="ØªÙˆÙÙŠØ± Ø²ÙˆØ§Ø­Ù ØµØ­ÙŠØ©..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-vision" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø±Ø¤ÙŠØªÙ†Ø§
                            </label>
                            <textarea
                                id="company-vision"
                                rows={4}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.vision}
                                onChange={e => setEditedInfo({ ...editedInfo, vision: e.target.value })}
                                placeholder="Ø£Ù† Ù†ÙƒÙˆÙ† Ø§Ù„Ù…Ø±ÙƒØ² Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠ Ø§Ù„Ø£ÙˆÙ„..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-story" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ù‚ØµØªÙ†Ø§
                            </label>
                            <textarea
                                id="company-story"
                                rows={6}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.story}
                                onChange={e => setEditedInfo({ ...editedInfo, story: e.target.value })}
                                placeholder="ØªØ£Ø³Ø³ Reptile House Ø¹Ø§Ù…..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 sticky bottom-6 bg-gradient-to-t from-[#0a0c10] pt-8 pb-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 shadow-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...' : 'Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-10 bg-white/5 text-gray-400 font-black rounded-[1.5rem] border border-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Ø¥Ù„ØºØ§Ø¡
                </button>
            </div>

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.company_info.title}
                sections={helpContent.company_info.sections}
            />
        </div>
    );
};

export default CompanyInfoManagementPage;

