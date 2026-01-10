export const getEventColor = (type: string) => {
    switch (type) {
        case 'CREATED': return 'bg-emerald-500'
        case 'TRANSFERRED': return 'bg-blue-500'
        case 'DELETED': return 'bg-rose-500'
        default: return 'bg-gray-400'
    }
}

export const getEventBadgeColor = (type: string) => {
    switch (type) {
        case 'CREATED': return 'bg-emerald-100 text-emerald-800'
        case 'TRANSFERRED': return 'bg-blue-100 text-blue-800'
        case 'DELETED': return 'bg-rose-100 text-rose-800'
        default: return 'bg-gray-100 text-gray-800'
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