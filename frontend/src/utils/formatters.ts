export const shortenAddress = (address: string | undefined): string => {
    if (!address) return ''
    // Muestra: 0x12...abcd
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: bigint) => {
    //Asegura que sea un número
    let valor = Number(timestamp)

    if (valor < 10000000000) {
        valor = valor * 1000 // Si el valor era mayor, eran segundos, lo pasa a ms
    }
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}
