
import React, { useState } from 'react';
import { Page } from '../App';

interface ResetPasswordPageProps {
    setPage: (page: Page) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ setPage }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmPassword) {
            console.log("Password reset successfully");
            setPage('login');
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">تعيين كلمة مرور جديدة</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="new-password"  className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور الجديدة</label>
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="********"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirm-password"  className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        حفظ كلمة المرور
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
