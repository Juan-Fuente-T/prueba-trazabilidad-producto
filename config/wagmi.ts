import { http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
// import { injected } from 'wagmi/connectors'

// export const config = createConfig({
//     chains: [sepolia],
    // connectors: [injected()],
    // transports: {
    //     [sepolia.id]: http()
    // }
    export const config = getDefaultConfig({
        appName: 'Product Traceability',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        chains: [sepolia],
        transports: {
            [sepolia.id]: http()
        }
    })