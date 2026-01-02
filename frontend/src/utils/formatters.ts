export const shortenAddress = (address: string | undefined): string => {
    if (!address) return ''
    // Muestra: 0x12...abcd
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}
