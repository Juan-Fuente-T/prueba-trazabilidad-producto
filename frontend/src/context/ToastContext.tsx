'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastType, Toast, ToastContextType } from '@/types/toast'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now()
        // Añade el toast a la lista
        setToasts(prev => [...prev, { id, message, type }])

        // Se autodestruye a los 3 segundos
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* RENDERIZADO DE LOS TOASTS (Container Flotante) */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            px-4 py-3 rounded shadow-lg border-l-4 text-sm font-medium animate-fade-in-up min-w-[300px] flex items-center justify-between
                            ${toast.type === 'success' ? 'bg-white border-emerald-500 text-emerald-800' : ''}
                            ${toast.type === 'error' ? 'bg-white border-red-500 text-red-800' : ''}
                            ${toast.type === 'info' ? 'bg-white border-industrial text-acero-800' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' : ''}
                        `}
                    >
                        <span>
                            {toast.type === 'success' && '✅ '}
                            {toast.type === 'error' && '❌ '}
                            {toast.type === 'warning' && '⚠️ '}
                            {toast.type === 'info' && 'ℹ️ '}
                            {toast.message}
                        </span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

// Hook personalizado para acceder al contexto
export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast debe usarse dentro de un ToastProvider')
    }
    return context
}