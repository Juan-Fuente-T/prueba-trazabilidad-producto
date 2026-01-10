'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useConnect, useAccount } from 'wagmi'

export default function Header() {
    const { connect, connectors } = useConnect()
    const { isConnected } = useAccount()

    const handleLogin = () => {
        // Buscamos el conector de Web3Auth entre todos los disponibles
        const web3AuthConnector = connectors.find(c => c.id === 'web3auth')

        if (web3AuthConnector) {
            connect({ connector: web3AuthConnector })
        }
    }
    return (
        <header className="flex justify-between items-center w-full fixed top-0 left-0 px-4 sm:px-6 py-3 z-50 border-b border-stone-500 bg-zinc-100 backdrop-blur-sm shadow-sm h-16 sm:h-20">
            {/* Logo - Izquierda (Más pequeño en móvil) */}
            <div className="flex-shrink-0">
                <Image
                    src="/cetim-centro-tecnologico-logo-web-2023.png"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="h-6 w-auto sm:h-9 transition-all" // h-6 en móvil
                    priority
                />
            </div>

            {/* Título - Centro (VISIBLE SIEMPRE) */}
            {/* Usamos absolute y centrado para que no empuje a los lados */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center w-40 sm:w-auto">
                <h1 className="text-[10px] leading-tight sm:text-lg font-bold text-stone-800 text-center">
                    Trazabilidad Producto
                </h1>
                <span className="text-[8px] sm:text-xs text-stone-500 font-medium hidden xs:block">
                    CETIM Blockchain
                </span>
            </div>

            {/* ZONA DE BOTONES A LA DERECHA */}
            <div className="flex items-center gap-3">

                {/* Botón Email / Google (Solo visible si NO está conectado) */}
                {!isConnected && (
                    <button
                        onClick={handleLogin}
                        className="hidden sm:flex items-center gap-2 bg-white text-stone-700 border border-stone-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-50 hover:border-stone-300 hover:scale-103 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-stone-400">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        Entrar con Email
                    </button>
                )}

                {/* Botón RainbowKit (Siempre visible) */}
                <div className="flex flex-shrink-0">
                    <ConnectButton
                        showBalance={{ smallScreen: false, largeScreen: false }} // Más limpio sin saldo
                        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                        chainStatus="icon" // Solo icono de red para ahorrar espacio
                    />
                </div>

            </div>
        </header>
    )
}