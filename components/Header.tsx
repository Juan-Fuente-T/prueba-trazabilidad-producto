'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function Header() {
    return (
        <header className="justify-between w-full fixed top-0 left-0 px-6 py-4 z-10">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <Image src="/cetim-centro-tecnologico-logo-web-2023.png" alt="Logo" width={150} height={10} />
                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Product Traceability
                </h1>
                {/* Botón de conexión */}
                <ConnectButton />
            </div>
        </header>
    )
}