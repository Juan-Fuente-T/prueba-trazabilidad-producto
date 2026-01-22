// src/components/dashboard/QuickOperationsPanel.tsx
'use client'
import { useState } from 'react'
import TransferProductModal from '@/components/products/modals/TransferProductModal'
import DeleteProductModal from '@/components/products/modals/DeleteProductModal'
import GenericActionController from '@/components/ui/GenericActionController'
import { useAccount } from 'wagmi'
import { ProductUI } from '@/types/product'

interface QuickOperationsPanelProps {
    actions?: {
        create: (p: ProductUI) => void;
        transfer: (data: { id: string | number, newOwner: string }) => void;
        delete: (id: string | number) => void;
        rollback: (id: string | number, type: 'create' | 'transfer' | 'delete') => void;
        attachHash: (id: string | number, txHash: string) => void;
    };
}

export default function QuickOperationsPanel({ actions }: QuickOperationsPanelProps) {
    const [targetId, setTargetId] = useState('')
    const { isConnected } = useAccount()

    // Función simple para limpiar el input cuando el modal termine
    const handleModalClose = () => {
        setTargetId('')
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8">
            <div className='flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center gap-2">
                    Operaciones Rápidas (Por ID)
                </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-48">
                    <label className="text-xs text-stone-400 block mb-1">ID del Lote</label>
                    <input
                        type="number"
                        placeholder="Ej: 5"
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        min={1}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-center md:justify-start">
                    <GenericActionController
                        buttonText="🔄 Asignar"
                        buttonColor="bg-indigo-500 hover:bg-indigo-600"
                        ModalComponent={TransferProductModal}
                        preFilledId={targetId}
                        disabled={!targetId || !isConnected}
                        modalProps={{
                            onOptimisticUpdate: (prod) => {
                                if (actions?.transfer && prod.blockchainId && prod.currentOwner) {
                                    actions.transfer({
                                        id: prod.blockchainId,
                                        newOwner: prod.currentOwner
                                    })
                                }
                            },
                            onRollback: (id) => actions?.rollback(id, 'transfer')
                        }}

                        // FASE CONFIRMACIÓN (ACOPLAR HASH)
                        // Se ejecuta cuando la Wallet devuelve el Hash
                        onSuccess={(data) => {
                            if (data && data.txHash && actions?.attachHash) {
                                actions.attachHash(targetId, data.txHash)
                            }
                            handleModalClose()
                        }}
                    />
                    <GenericActionController
                        buttonText="🗑️ Baja"
                        buttonColor="bg-rose-400 hover:bg-rose-500"
                        ModalComponent={DeleteProductModal}
                        preFilledId={targetId}
                        disabled={!targetId || !isConnected}
                        modalProps={{
                            onOptimisticDelete: (id) => {
                                if (actions?.delete) actions.delete(id)
                            },
                            onRollback: (id) => actions?.rollback(id, 'delete')
                        }}

                        // FASE CONFIRMACIÓN
                        onSuccess={(data) => {
                            if (data && data.txHash && actions?.attachHash) {
                                actions.attachHash(targetId, data.txHash)
                            }
                            handleModalClose()
                        }}
                    />
                    {!isConnected &&
                        <span className="text-stone-400 text-sm md:text-md font-semibold italic mt-2 px-2 py-1 text-wrap bg-stone-100 rounded-md">
                            Conéctate para operar
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}