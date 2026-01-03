export const shortenAddress = (address: string | undefined): string => {
    if (!address) return ''
    // Muestra: 0x12...abcd
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: number | bigint | string) => {
    if (!timestamp) return '-'

    if (typeof timestamp === 'string' && (timestamp.includes('-') || timestamp.includes('T'))) {
        const date = new Date(timestamp)
        return formatDateTime(date)
    }

    let valor = Number(timestamp)

    if (valor < 10000000000) {
        valor = valor * 1000 // Si el valor era mayor, eran segundos, lo pasa a ms
    }
    const date = new Date(valor)
    return formatDateTime(date)
}

function formatDateTime(date: Date): string {
    // Verifica que la fecha sea válida antes de formatear
    if (isNaN(date.getTime())) return 'Fecha inválida'

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}