
import React, { useEffect, useState } from 'react';
import { PolicyDocument } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, DocumentIcon, CheckCircleIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { api } from '../../services/api';

const defaultPolicies: PolicyDocument[] = [
    {
        id: 'privacy',
        type: 'privacy',
        title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©',
        content: 'Ù†Ø­Ù† ÙÙŠ Reptile House Ù†Ø­ØªØ±Ù… Ø®ØµÙˆØµÙŠØªÙƒ ÙˆÙ†Ù„ØªØ²Ù… Ø¨Ø­Ù…Ø§ÙŠØ© Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙƒ Ø§Ù„Ø´Ø®ØµÙŠØ©...',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true,
        icon: 'ðŸ”’'
    },
    {
        id: 'returns',
        type: 'returns',
        title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„',
        content: 'ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø±Ø¬Ø§Ø¹ Ø£Ùˆ Ø§Ø³ØªØ¨Ø¯Ø§Ù„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø®Ù„Ø§Ù„ 7 Ø£ÙŠØ§Ù… Ù…Ù† ØªØ§Ø±ÙŠØ® Ø§Ù„Ø´Ø±Ø§Ø¡...',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true,
        icon: 'ðŸ”„'
    },
    {
        id: 'warranty',
        type: 'warranty',
        title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¶Ù…Ø§Ù†',
        content: 'Ù†Ø¶Ù…Ù† ØµØ­Ø© Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø²ÙˆØ§Ø­Ù Ù„Ù…Ø¯Ø© 30 ÙŠÙˆÙ…Ø§Ù‹ Ù…Ù† ØªØ§Ø±ÙŠØ® Ø§Ù„Ø´Ø±Ø§Ø¡...',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true,
        icon: 'âœ…'
    },
    {
        id: 'terms',
        type: 'terms',
        title: 'Ø´Ø±ÙˆØ· Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…',
        content: 'Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù…Ùƒ Ù„Ù‡Ø°Ø§ Ø§Ù„Ù…ÙˆÙ‚Ø¹ØŒ ÙØ¥Ù†Ùƒ ØªÙˆØ§ÙÙ‚ Ø¹Ù„Ù‰ Ø§Ù„Ø´Ø±ÙˆØ· ÙˆØ§Ù„Ø£Ø­ÙƒØ§Ù… Ø§Ù„ØªØ§Ù„ÙŠØ©...',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true,
        icon: 'ðŸ“‹'
    },
    {
        id: 'shipping',
        type: 'shipping',
        title: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„',
        content: 'Ù†ÙˆÙØ± Ø®Ø¯Ù…Ø© Ø§Ù„ØªÙˆØµÙŠÙ„ Ù„Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø§Øª Ø§Ù„Ø³ÙˆØ±ÙŠØ© Ø®Ù„Ø§Ù„ 2-5 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„...',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true,
        icon: 'ðŸšš'
    }
];

const policyTypeLabels = {
    privacy: 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©',
    returns: 'Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„',
    warranty: 'Ø§Ù„Ø¶Ù…Ø§Ù†',
    terms: 'Ø´Ø±ÙˆØ· Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…',
    shipping: 'Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„',
    custom: 'Ø³ÙŠØ§Ø³Ø© Ù…Ø®ØµØµØ©'
};

const PoliciesManagementPage: React.FC = () => {
    const [policies, setPolicies] = useState<PolicyDocument[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Partial<PolicyDocument> | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const savePolicies = async (newPolicies: PolicyDocument[]) => {
        setPolicies(newPolicies);
        await Promise.all(newPolicies.map((policy) => api.savePolicy(policy)));
    };

    useEffect(() => {
        api.getPolicies().then((rows) => setPolicies(rows.length ? rows : defaultPolicies)).catch(() => setPolicies(defaultPolicies));
    }, []);

    const handleOpenModal = (policy?: PolicyDocument) => {
        if (policy) {
            setEditingPolicy({ ...policy });
        } else {
            setEditingPolicy({
                id: `policy-${Date.now()}`,
                type: 'custom',
                title: '',
                content: '',
                lastUpdated: new Date().toISOString().split('T')[0],
                isActive: true,
                icon: 'ðŸ“„'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPolicy) {
            if (!editingPolicy.title || !editingPolicy.content) {
                alert('ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©');
                return;
            }

            const policyToSave: PolicyDocument = {
                id: editingPolicy.id || `policy-${Date.now()}`,
                type: editingPolicy.type || 'custom',
                title: editingPolicy.title,
                content: editingPolicy.content,
                lastUpdated: new Date().toISOString().split('T')[0],
                isActive: editingPolicy.isActive !== undefined ? editingPolicy.isActive : true,
                icon: editingPolicy.icon || 'ðŸ“„'
            };

            const existingIndex = policies.findIndex(p => p.id === policyToSave.id);
            let newPolicies: PolicyDocument[];
            if (existingIndex > -1) {
                newPolicies = [...policies];
                newPolicies[existingIndex] = policyToSave;
            } else {
                newPolicies = [...policies, policyToSave];
            }
            await await savePolicies(newPolicies);
            setIsModalOpen(false);
            setEditingPolicy(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setConfirmDelete({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.id) {
            const newPolicies = policies.filter(p => p.id !== confirmDelete.id);
            await await savePolicies(newPolicies);
        }
        setConfirmDelete({ isOpen: false, id: null });
    };

    const togglePolicyStatus = async (id: string) => {
        const newPolicies = policies.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        );
        await await savePolicies(newPolicies);
    };

    const activePolicies = policies.filter(p => p.isActive);

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø³ÙŠØ§Ø³Ø§Øª ÙˆØ§Ù„Ø¶Ù…Ø§Ù†Ø§Øª</h1>
                    <p className="text-gray-400">ØªØ­ÙƒÙ… ÙÙŠ Ø³ÙŠØ§Ø³Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¶Ù…Ø§Ù†Ø§Øª</p>
                </div>
                <div className="flex gap-3">
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Ø¥Ø¶Ø§ÙØ© Ø³ÙŠØ§Ø³Ø© Ø¬Ø¯ÙŠØ¯Ø©</span>
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø³ÙŠØ§Ø³Ø§Øª</p>
                            <p className="text-3xl font-black text-amber-400 font-poppins">{policies.length}</p>
                        </div>
                        <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl">
                            <DocumentIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">Ø§Ù„Ø³ÙŠØ§Ø³Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©</p>
                            <p className="text-3xl font-black text-green-400 font-poppins">{activePolicies.length}</p>
                        </div>
                        <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl">
                            <CheckCircleIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«</p>
                            <p className="text-lg font-black text-blue-400">
                                {policies.length > 0 ? policies[0].lastUpdated : 'N/A'}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                            <DocumentIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policies.map(policy => (
                    <div
                        key={policy.id}
                        className={`glass-dark border rounded-[2rem] p-6 group hover:border-amber-500/30 transition-all shadow-xl ${
                            policy.isActive ? 'border-white/10' : 'border-gray-500/30 opacity-60'
                        }`}
                    >
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="text-4xl">{policy.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black mb-2 group-hover:text-amber-400 transition-colors">
                                            {policy.title}
                                        </h3>
                                        <span className="px-3 py-1 bg-white/5 text-gray-300 border border-white/5 rounded-lg text-xs font-bold">
                                            {policyTypeLabels[policy.type]}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(policy)}
                                        className="p-2 bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all border border-white/5"
                                        aria-label={`ØªØ¹Ø¯ÙŠÙ„ ${policy.title}`}
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(policy.id)}
                                        className="p-2 bg-red-500/5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all border border-red-500/10"
                                        aria-label={`Ø­Ø°Ù ${policy.title}`}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <p className="text-sm text-gray-400 line-clamp-3">
                                    {policy.content}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="text-xs text-gray-500">
                                    Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«: {policy.lastUpdated}
                                </div>
                                <button
                                    onClick={() => togglePolicyStatus(policy.id)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                        policy.isActive
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
                                    }`}
                                >
                                    {policy.isActive ? 'âœ“ Ù†Ø´Ø·' : 'âœ— Ù…Ø¹Ø·Ù„'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {policies.length === 0 && (
                <div className="text-center py-20 text-gray-600 font-bold border-2 border-dashed border-white/5 rounded-[2rem] glass-medium">
                    <DocumentIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                    <p>Ù„Ø§ ØªÙˆØ¬Ø¯ Ø³ÙŠØ§Ø³Ø§Øª. Ø§Ø¨Ø¯Ø£ Ø¨Ø¥Ø¶Ø§ÙØ© Ø³ÙŠØ§Ø³Ø© Ø¬Ø¯ÙŠØ¯Ø©!</p>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                title="ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø°Ù"
                message="Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ù‡ Ø§Ù„Ø³ÙŠØ§Ø³Ø©ØŸ Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ±Ø§Ø¬Ø¹ Ø¹Ù† Ù‡Ø°Ù‡ Ø§Ù„Ø¹Ù…Ù„ÙŠØ©."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                        role="presentation"
                        aria-hidden="true"
                    ></div>
                    <form
                        onSubmit={handleSave}
                        className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0f1117]"
                    >
                        <h2 className="text-4xl font-black mb-10 text-white tracking-tighter">
                            {editingPolicy?.id && policies.find(p => p.id === editingPolicy.id)
                                ? 'ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø³ÙŠØ§Ø³Ø©'
                                : 'Ø¥Ø¶Ø§ÙØ© Ø³ÙŠØ§Ø³Ø© Ø¬Ø¯ÙŠØ¯Ø©'}
                        </h2>

                        <div className="space-y-6 text-right">
                            {/* Type Selection */}
                            <div>
                                <label htmlFor="policy-type" className="text-xs font-black text-amber-500 uppercase mb-2 block">
                                    Ù†ÙˆØ¹ Ø§Ù„Ø³ÙŠØ§Ø³Ø© <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="policy-type"
                                    type="text"
                                    required
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                    value={editingPolicy?.type || 'custom'}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, type: e.target.value as any })}
                                    placeholder="privacy, returns, warranty, terms, shipping, custom"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Ø§Ù„Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ù…ØªØ§Ø­Ø©: privacy, returns, warranty, terms, shipping, custom
                                </p>
                            </div>

                            {/* Icon */}
                            <div>
                                <label htmlFor="policy-icon" className="text-xs font-black text-amber-500 uppercase mb-2 block">
                                    Ø§Ù„Ø£ÙŠÙ‚ÙˆÙ†Ø© (Emoji)
                                </label>
                                <input
                                    id="policy-icon"
                                    type="text"
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-2xl"
                                    value={editingPolicy?.icon || 'ðŸ“„'}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, icon: e.target.value })}
                                    placeholder="ðŸ“„"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="policy-title" className="text-xs font-black text-amber-500 uppercase mb-2 block">
                                    Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø³ÙŠØ§Ø³Ø© <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="policy-title"
                                    required
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                    value={editingPolicy?.title || ''}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                                    placeholder="Ù…Ø«Ù„Ø§Ù‹: Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label htmlFor="policy-content" className="text-xs font-black text-amber-500 uppercase mb-2 block">
                                    Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø³ÙŠØ§Ø³Ø© <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="policy-content"
                                    required
                                    rows={12}
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                    value={editingPolicy?.content || ''}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, content: e.target.value })}
                                    placeholder="Ø§ÙƒØªØ¨ Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ø¨Ø§Ù„ØªÙØµÙŠÙ„..."
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø­Ø±Ù: {editingPolicy?.content?.length || 0}
                                </p>
                            </div>

                            {/* Active Toggle */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingPolicy?.isActive !== false}
                                        onChange={e => setEditingPolicy({ ...editingPolicy, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-transparent text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-white font-bold">ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙˆÙ‚Ø¹</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-12">
                            <button
                                type="submit"
                                className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 shadow-2xl text-lg"
                            >
                                Ø­ÙØ¸ Ø§Ù„Ø³ÙŠØ§Ø³Ø©
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 bg-white/5 text-gray-400 font-black rounded-[1.5rem] border border-white/5"
                            >
                                Ø¥Ù„ØºØ§Ø¡
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.policies.title}
                sections={helpContent.policies.sections}
            />
        </div>
    );
};

export default PoliciesManagementPage;

