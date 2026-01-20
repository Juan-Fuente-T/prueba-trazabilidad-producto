// Tipos de notificaciones
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: number
    message: string
    type: ToastType
}

export interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void
}
