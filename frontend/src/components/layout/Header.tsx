'use client'

// import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useConnect, useAccount, useDisconnect } from 'wagmi'

export default function Header() {
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()

    const handleLogin = () => {
        // Buscamos el conector de Web3Auth entre todos los disponibles
        const web3AuthConnector = connectors.find(c => c.id === 'web3auth')

        if (web3AuthConnector) {
            connect({ connector: web3AuthConnector })
        }
    }
    return (
        <header className="flex justify-between items-center w-full fixed top-0 left-0 px-4 sm:px-6 py-0 z-50 border-b border-acero-700 bg-acero-900 shadow-md h-16">
            {/* Logo - Izquierda (Más pequeño en móvil) */}
            <div className="flex items-center gap-4">
                {/* <div className="flex-shrink-0"> */}
                <div className="flex items-center gap-4">
                    <Image
                        src="/cetim-centro-tecnologico-logo-web-2023.png"
                        alt="Logo"
                        width={120}
                        height={40}
                        className="h-6 w-auto brightness-0 invert"
                        priority
                    />
                </div>
                <div className="hidden xs:flex flex-col border-l border-acero-600 pl-4 h-8 justify-center"></div>
                <h1 className="text-sm font-bold text-acero-100 tracking-wide uppercase">
                    Plataforma Trazabilidad
                </h1>
                <span className="text-[10px] text-industrial font-mono">
                    V.2.0 • INDUSTRIAL
                </span>
            </div>

            {/* ZONA DE BOTONES A LA DERECHA */}
            <div className="flex items-center gap-3 ml-8 md:ml-0">

                {/* CASO 1: NO CONECTADO -> Botón Login */}
                {/* Botón Email / Google (Solo visible si NO está conectado) */}
                {!isConnected ? (
                    <button
                        onClick={handleLogin}
                        className="flex items-center gap-2 bg-acero-800 text-acero-200 border border-acero-600 px-4 py-2 rounded font-mono text-xs hover:bg-acero-700 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-industrial">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        ACCESO OPERARIO
                    </button>) : (
                    /* CASO 2: CONECTADO -> Info + Botón Salir */
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Info Usuario (Email/Address) */}
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-acero-400 uppercase tracking-wider hidden sm:block">Sesión Activa</span>
                            <span className="text-xs font-mono text-industrial font-bold">
                                {address ? `${address.substring(0, 6)}...${address.slice(-4)}` : 'Usuario'}
                            </span>
                        </div>

                        {/* Botón Logout */}
                        <button
                            onClick={() => disconnect()}
                            className="flex items-center justify-center bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 hover:text-red-200 rounded p-2 transition-all"
                            title="Cerrar Sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5V15a.75.75 0 00-1.5 0v3.75a3 3 0 003 3h6a3 3 0 003-3V5.25a3 3 0 00-3-3h-6a3 3 0 00-3 3V9A.75.75 0 109 9V5.25a1.5 1.5 0 011.5-1.5h6zm-5.03 4.72a.75.75 0 000 1.06l1.72 1.72H2.25a.75.75 0 000 1.5h10.94l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 00-1.06 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Botón RainbowKit (Siempre visible) */}
                {/* <div className="flex flex-shrink-0">
                    <ConnectButton
                        showBalance={{ smallScreen: false, largeScreen: false }} // Más limpio sin saldo
                        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                        chainStatus="icon" // Solo icono de red para ahorrar espacio
                    />
                </div> */}

            </div>
        </header>
    )
}