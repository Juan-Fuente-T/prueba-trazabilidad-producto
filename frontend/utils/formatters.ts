export const shortenAddress = (address: string | undefined): string => {
    if (!address) return ''
    // Muestra: 0x12...abcd
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}