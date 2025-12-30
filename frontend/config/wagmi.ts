import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

    export const config = getDefaultConfig({
        appName: 'Product Traceability',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        chains: [sepolia],
        ssr: true,
        })
        declare module 'wagmi' {
            interface Register {
                config: typeof config
            }
        }