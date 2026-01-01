'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function Header() {
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

            {/* ConnectButton - Derecha */}
            {/* <div className="flex-shrink-0">
                <ConnectButton
                    showBalance={{ smallScreen: false, largeScreen: true }}
                    accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                />
            </div> */}
            <div className="flex-shrink-0 transform scale-90 sm:scale-100 origin-right">
                <ConnectButton
                    showBalance={{ smallScreen: false, largeScreen: true }}
                    accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                />
            </div>
        </header>
    )
}