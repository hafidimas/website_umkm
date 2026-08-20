'use client';

import React from 'react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
    const { toasts } = useShop();

    return (
        <div className="toast-container" id="toastContainer">
            {toasts.map(toast => (
                <div className="toast" key={toast.id}>
                    <i className={`fa-solid ${toast.icon}`}></i>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};
