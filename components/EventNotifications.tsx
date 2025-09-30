'use client'

import { useState } from 'react'
import { useProductEvents } from '../hooks/useProductEvents'

type Notification = {
    id: number
    message: string
    type: 'success' | 'info' | 'warning'
}

export default function EventNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useProductEvents((message: string, type: 'success' | 'info' | 'warning') => {
        const newNotif: Notification = {
            id: Date.now(),
            message,
            type
        }

        setNotifications(prev => [...prev, newNotif])

        // Se elimina después de 15 segundos
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotif.id))
        }, 15000)
    })

    const getColorClasses = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800'
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            default: return 'bg-gray-50 border-gray-200 text-gray-800'
        }
    }

    return (
        // <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <div className="border border-gray-900 rounded p-8">
            {/* Notificaciones */}
            <h2 className="flex justify-center text-lg font-bold mb-4">Notificaciones de Eventos</h2>
            {notifications.map(notif => (
                <div
                    key={notif.id}
                    className={`px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${getColorClasses(notif.type)}`}
                >
                    <p className="text-sm font-medium">{notif.message}</p>
                </div>
            ))}
        </div>
        // </div>
    )
}