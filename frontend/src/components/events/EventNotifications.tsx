'use client'
import { useState, useEffect } from 'react'
// Suponemos que tienes un hook useProductEvents, si no, usa un useEffect normal para simular
// import { useProductEvents } from '@/hooks/useProductEvents'
import { useProductEvents } from '@/hooks/blockchain/useProductEvents'


interface Notification {
    id: number;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
}

export default function EventNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    // ESTO ES UN MOCK PARA DEMOSTRAR NOTIFICACIONES
    // Función auxiliar para añadir (se usa en el botón de prueba)
    const addNotification = (message: string, type: 'success' | 'info' | 'warning') => {
        const newNotif: Notification = {
            id: Date.now(),
            message,
            type
        }
        setNotifications(prev => [newNotif, ...prev])
    }

    useProductEvents((message: string, type: 'success' | 'info' | 'warning') => {
        const newNotif: Notification = {
            id: Date.now(),
            message,
            type
        }
        // AÑADE AL PRINCIPIO (unshift) para que lo más nuevo salga arriba
        setNotifications(prev => [newNotif, ...prev])
    })

    const getColorClasses = (type: string) => {
        switch (type) {
            case 'success': return 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800'
            case 'info': return 'bg-blue-50 border-l-4 border-indigo-500 text-indigo-800'
            case 'warning': return 'bg-amber-50 border-l-4 border-amber-500 text-amber-800'
            default: return 'bg-gray-50 border-l-4 border-gray-500 text-gray-800'
        }
    }

    // Si no hay notificaciones, no mostramos nada para no ensuciar
    // if (notifications.length === 0) return null;

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 animate-fade-in-up">
            
            {/* --- BOTÓN TEMPORAL DE PRUEBA (BORRAR ANTES DE ENTREGA) --- */}
            <button 
                onClick={() => addNotification("Evento de prueba: Producto Creado con éxito", "info")}
                className="mb-2 text-xs text-stone-400 hover:text-stone-600 underline"
            >
                [Dev] Simular Evento
            </button>
            {/* ----------------------------------------------------------- */}

            {notifications.length > 0 && (
                <div className="bg-stone-200 rounded-xl w-full shadow-md border border-stone-200 p-6 overflow-hidden">
                    <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex justify-between items-center rounded">
                        <h3 className="font-bold text-stone-700 text-sm flex items-center gap-2">
                           📜 Últimos Eventos Registrados
                        </h3>
                        {/* <span className="text-xs text-stone-400">Sesión actual</span> */}
                    </div>

                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto bg-stone-50/50">
                        {notifications.map(notif => (
                            <div key={notif.id} className={`p-3 rounded-md text-sm font-medium shadow-sm flex justify-between items-start gap-4 ${getColorClasses(notif.type)}`}>
                                <span>{notif.message}</span>
                                <span className="text-xs opacity-70 whitespace-nowrap">{new Date(notif.id).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}