export const getEventColor = (type: string) => {
    switch (type) {
        case 'CREATED': return 'bg-emerald-500'
        case 'TRANSFERRED': return 'bg-blue-500'
        case 'DELETED': return 'bg-rose-500'
        default: return 'bg-acero-400'
    }
}

export const getEventBadgeColor = (type: string) => {
    switch (type) {
        case 'CREATED': return 'bg-emerald-100 text-emerald-800'
        case 'TRANSFERRED': return 'bg-blue-100 text-blue-800'
        case 'DELETED': return 'bg-rose-100 text-rose-800'
        default: return 'bg-acero-100 text-acero-800'
    }
}

export const getEventIcon = (type: string) => {
    switch (type) {
        case 'CREATED': return '✨'
        case 'TRANSFERRED': return '🔄'
        case 'DELETED': return '🔥'
        default: return '●'
    }
}


export const getShortDescription = (type: string) => {
    switch (type) {
        case 'CREATED': return 'Registrado en Red'
        case 'TRANSFERRED': return 'Cambio de Titular'
        case 'DELETED': return 'Borrado de Activo'
        default: return 'Evento'
    }
}

// Badge específico para el estado de sincronización Blockchain
export const getSyncBadgeStyles = (isPending: boolean) => {
    if (isPending) {
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100";
    }
    // Si está verificado, devuelve estilos neutros/invisibles o un verde muy sutil
    return "bg-transparent text-emerald-600 border-transparent";
}