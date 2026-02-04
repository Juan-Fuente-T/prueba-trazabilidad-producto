'use client'

import { useEffect, useState, useRef } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import Modal from '@/components/ui/Modal'

export default function WelcomeFundsManager() {
    const { address, isConnected } = useAccount()
    const { data: balance } = useBalance({ address })
    const [isOpen, setIsOpen] = useState(false)
    // const [amount, setAmount] = useState<string>("0.02")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('none')
    const hasCheckedRef = useRef(false)

    useEffect(() => {
        const checkAndRequestFunds = async () => {
            if (!isConnected || !address || hasCheckedRef.current || loading) return

            if (!balance) return

            if (balance && parseFloat(formatEther(balance.value)) < 0.001) {
                hasCheckedRef.current = true
                setLoading(true)
                setStatus('sending')
                setIsOpen(true)

                try {
                    const response = await fetch('/api/faucet', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userAddress: address })
                    })
                    const data = await response.json()

                    if (data.success) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                } catch (error) {
                    console.error("Error en faucet:", error)
                    setStatus('error')
                } finally {
                    setLoading(false)
                }
            } else {
                // Si tiene saldo, marcamos como revisado y no hacemos NADA
                hasCheckedRef.current = true
            }
        }
        checkAndRequestFunds()
    }, [isConnected, address, balance, loading])

    if (!isOpen) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="¡Nueva Cuenta!"
        >
            <div className="bg-white rounded-lg shadow-2xl w-full border-2 border-acero-800 overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">

                {/* Cabecera visual */}
                <div className="bg-acero-600 p-6 flex flex-col items-center justify-center text-white">
                    <div className="bg-white/20 p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-wide">¡Cuenta Activada!</h2>
                </div>

                {/* Contenido */}
                <div className="p-6 text-center">
                    <p className="text-acero-600 mb-4 font-medium text-lg">
                        Bienvenido a la plataforma de pruebas.
                    </p>
                    <p className="text-acero-600 text-sm mb-6 leading-relaxed">
                        Puedes operar sin problemas.
                    </p>
                    {status !== 'sending' && (
                        <div className="p-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-acero-800 text-white py-3 px-4 rounded font-bold hover:bg-acero-800 transition-colors uppercase tracking-wider text-sm shadow-lg"
                            >
                                Entendido
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}