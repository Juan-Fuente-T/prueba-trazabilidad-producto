// src/components/dashboard/QuickOperationsPanel.tsx
'use client'
import { useState } from 'react'
// Importa tus modales aquí
import TransferProductModal from '@/components/products/modals/TransferProductModal'
import DeleteProductModal from '@/components/products/modals/DeleteProductModal'
import GenericActionController from '@/components/ui/GenericActionController'

export default function QuickOperationsPanel() {
    const [targetId, setTargetId] = useState('')

    return (
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8">
            <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center gap-2">
                ⚡ Operaciones Rápidas (Por ID)
            </h3>

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
                        buttonText="🔄 Transferir"
                        buttonColor="bg-indigo-500 hover:bg-indigo-600"
                        ModalComponent={TransferProductModal}
                        preFilledId={targetId}
                        disabled={!targetId}
                    />
                    <GenericActionController
                        buttonText="🗑️ Borrar"
                        buttonColor="bg-rose-400 hover:bg-rose-500"
                        ModalComponent={DeleteProductModal}
                        preFilledId={targetId}
                        disabled={!targetId}
                    />
                </div>
            </div>
        </div>
    )
}