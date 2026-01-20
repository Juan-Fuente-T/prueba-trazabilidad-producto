// src/components/dashboard/QuickOperationsPanel.tsx
'use client'
import { useState } from 'react'
import TransferProductModal from '@/components/products/modals/TransferProductModal'
import DeleteProductModal from '@/components/products/modals/DeleteProductModal'
import GenericActionController from '@/components/ui/GenericActionController'
import { useAccount } from 'wagmi'
import { OperationResult, OperationResultWithID } from '@/types/operations';

interface QuickOperationsPanelProps {
    onOperationSuccess?: (type: 'TRANSFER' | 'DELETE', data: OperationResultWithID) => void
}

export default function QuickOperationsPanel({ onOperationSuccess }: QuickOperationsPanelProps) {
    const [targetId, setTargetId] = useState('')
    const { isConnected } = useAccount()

    // Esta función que se pasa al Modal SOLO en el buscador
    const handleSearchSuccess = (actionType: 'TRANSFER' | 'DELETE', payload: OperationResult) => {
        // Optimistic UI en el resultado de búsqueda
        if (onOperationSuccess && targetId) {
            const dataFinal: OperationResultWithID = {
                id: targetId,// El ID del estado
                ...payload // Se añade lo que viene del modal (newOwner, etc)
            };
            onOperationSuccess(actionType, dataFinal);
        }
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
                    <label className="text-xs text-stone-400 block mb-1">ID del Producto</label>
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
                        onSuccess={(data) => {
                            if (data && onOperationSuccess) {
                                handleSearchSuccess('TRANSFER', data)
                            }
                        }}
                    />
                    <GenericActionController
                        buttonText="🗑️ Baja"
                        buttonColor="bg-rose-400 hover:bg-rose-500"
                        ModalComponent={DeleteProductModal}
                        preFilledId={targetId}
                        disabled={!targetId || !isConnected}
                        onSuccess={(data) => {
                            if (data && onOperationSuccess) {
                                handleSearchSuccess('DELETE', data)
                            }
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