
import React, { useState, useEffect } from 'react';
import { ContactInfo } from '../../types';
import { api } from '../../services/api';
import { EditIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const ContactInfoManagementPage: React.FC = () => {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '', address: '', city: '', country: '', workingHours: '', socialMedia: {} });
    const [isEditing, setIsEditing] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [editedInfo, setEditedInfo] = useState<ContactInfo>(contactInfo);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        api.getContactInfo().then((info) => {
            setContactInfo(info);
            setEditedInfo(info);
        }).catch(() => {});
    }, []);

    const handleSave = () => {
        if (!editedInfo.phone || !editedInfo.email) {
            alert('ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© (Ø§Ù„Ù‡Ø§ØªÙ ÙˆØ§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ)');
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            api.saveContactInfo(editedInfo).catch(() => {});
            setContactInfo(editedInfo);
            setIsEditing(false);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 500);
    };

    const handleCancel = () => {
        setEditedInfo(contactInfo);
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="animate-fade-in relative space-y-8 text-right">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„</h1>
                        <p className="text-gray-400">Ø¥Ø¯Ø§Ø±Ø© Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„ ÙˆÙˆØ³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠ</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ</p>
                                <p className="text-white font-bold text-lg font-poppins" dir="ltr">{contactInfo.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ</p>
                                <p className="text-white font-bold text-lg">{contactInfo.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„</p>
                                <p className="text-white font-bold">{contactInfo.workingHours}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">Ø§Ù„Ù…ÙˆÙ‚Ø¹</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ø¹Ù†ÙˆØ§Ù†</p>
                                <p className="text-white font-bold">{contactInfo.address}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©</p>
                                <p className="text-white font-bold">{contactInfo.city}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø§Ù„Ø¯ÙˆÙ„Ø©</p>
                                <p className="text-white font-bold">{contactInfo.country}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contactInfo.socialMedia?.facebook && (
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ÙÙŠØ³Ø¨ÙˆÙƒ</p>
                                <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                                    {contactInfo.socialMedia.facebook}
                                </a>
                            </div>
                        )}
                        {contactInfo.socialMedia?.instagram && (
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ø¥Ù†Ø³ØªØºØ±Ø§Ù…</p>
                                <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline break-all">
                                    {contactInfo.socialMedia.instagram}
                                </a>
                            </div>
                        )}
                        {contactInfo.socialMedia?.whatsapp && (
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ÙˆØ§ØªØ³Ø§Ø¨</p>
                                <p className="text-green-400 font-poppins" dir="ltr">{contactInfo.socialMedia.whatsapp}</p>
                            </div>
                        )}
                        {contactInfo.socialMedia?.telegram && (
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ØªÙŠÙ„ÙŠØ¬Ø±Ø§Ù…</p>
                                <a href={contactInfo.socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all">
                                    {contactInfo.socialMedia.telegram}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Modal */}
                <HelpModal
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                    title={helpContent.contact_info.title}
                    sections={helpContent.contact_info.sections}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">ØªØ¹Ø¯ÙŠÙ„ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„</h1>
                    <p className="text-gray-400">Ù‚Ù… Ø¨ØªØ­Ø¯ÙŠØ« Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„ ÙˆØ­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª</p>
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
                {/* Contact Info */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.phone}
                                onChange={e => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                                placeholder="+963 XXX XXX XXX"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.email}
                                onChange={e => setEditedInfo({ ...editedInfo, email: e.target.value })}
                                placeholder="info@example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.workingHours}
                                onChange={e => setEditedInfo({ ...editedInfo, workingHours: e.target.value })}
                                placeholder="Ø§Ù„Ø³Ø¨Øª - Ø§Ù„Ø®Ù…ÙŠØ³: 9:00 ØµØ¨Ø§Ø­Ø§Ù‹ - 8:00 Ù…Ø³Ø§Ø¡Ù‹"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">Ø§Ù„Ù…ÙˆÙ‚Ø¹</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ù„Ø¹Ù†ÙˆØ§Ù†
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.address}
                                onChange={e => setEditedInfo({ ...editedInfo, address: e.target.value })}
                                placeholder="Ø¯Ù…Ø´Ù‚ØŒ Ø³ÙˆØ±ÙŠØ§"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.city}
                                onChange={e => setEditedInfo({ ...editedInfo, city: e.target.value })}
                                placeholder="Ø¯Ù…Ø´Ù‚"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø§Ù„Ø¯ÙˆÙ„Ø©
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.country}
                                onChange={e => setEditedInfo({ ...editedInfo, country: e.target.value })}
                                placeholder="Ø³ÙˆØ±ÙŠØ§"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                ÙÙŠØ³Ø¨ÙˆÙƒ (URL)
                            </label>
                            <input
                                type="url"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.socialMedia?.facebook || ''}
                                onChange={e => setEditedInfo({
                                    ...editedInfo,
                                    socialMedia: { ...editedInfo.socialMedia, facebook: e.target.value }
                                })}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                Ø¥Ù†Ø³ØªØºØ±Ø§Ù… (URL)
                            </label>
                            <input
                                type="url"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.socialMedia?.instagram || ''}
                                onChange={e => setEditedInfo({
                                    ...editedInfo,
                                    socialMedia: { ...editedInfo.socialMedia, instagram: e.target.value }
                                })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                ÙˆØ§ØªØ³Ø§Ø¨ (Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ù…Ø¹ Ø±Ù…Ø² Ø§Ù„Ø¯ÙˆÙ„Ø©)
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.socialMedia?.whatsapp || ''}
                                onChange={e => setEditedInfo({
                                    ...editedInfo,
                                    socialMedia: { ...editedInfo.socialMedia, whatsapp: e.target.value }
                                })}
                                placeholder="963993595766"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                ØªÙŠÙ„ÙŠØ¬Ø±Ø§Ù… (URL)
                            </label>
                            <input
                                type="url"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.socialMedia?.telegram || ''}
                                onChange={e => setEditedInfo({
                                    ...editedInfo,
                                    socialMedia: { ...editedInfo.socialMedia, telegram: e.target.value }
                                })}
                                placeholder="https://t.me/..."
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
                title={helpContent.contact_info.title}
                sections={helpContent.contact_info.sections}
            />
        </div>
    );
};

export default ContactInfoManagementPage;

