'use client'
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import TransferProductModal from '@/components/products/modals/TransferProductModal';
import DeleteProductModal from '@/components/products/modals/DeleteProductModal';
import { Event } from '@/types/events';
import { TransferSuccessData, DeleteSuccessData } from '@/types/operations';
import { ProductDB } from '@/types/product';
import ProductHistory from '@/components/products/history/ProductHistory';
import { shortenAddress, formatDate } from '@/utils/formatters'
import { getRoleName } from '@/utils/roleUtils'
import { createOptimisticEvent } from '@/utils/optimisticFactory';
// import { useProductTransferLogic } from '@/hooks/orchestration/useProductTransferLogic';

interface ProductDetailProps {
    productDB: ProductDB;
    eventListDB: Event[];
    onDataUpdate: (newOwner?: string, newEvent?: Event) => void;
}

export default function ProductDetailCard({ productDB, eventListDB, onDataUpdate }: ProductDetailProps) {
    const { address } = useAccount();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Verifica si es el dueño comparando direcciones
    const isOwner = address && productDB?.currentOwner &&
        address.toLowerCase() === productDB?.currentOwner.toLowerCase();

    const handleCopy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => alert("Hash copiado!"));
        }
    }
    // const { status } = useProductTransferLogic(closeModal)

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up pb-20">

            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">

                {/* HEADER: ID y ESTADO */}
                <div className={`p-6 sm:p-8 text-white ${isOwner ? 'bg-indigo-900' : 'bg-stone-700'}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded shadow-sm ${productDB?.active ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {productDB?.active ? 'ACTIVO' : 'INACTIVO'}
                                </span>
                                <span className="text-lg font-bold text-stone-100">
                                    {getRoleName(productDB.currentOwner)}
                                </span>
                                {isOwner && (
                                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded shadow-sm border border-amber-500">
                                        ⭐ TU PRODUCTO
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold">Producto #{productDB?.blockchainId}</h1>
                            <h2 className="text-xl text-white/80 mt-1">{productDB?.name}</h2>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-white/60 text-sm">Registrado el</p>
                            {productDB?.timestamp ? (
                                <p className="font-mono">{formatDate(BigInt(productDB.timestamp))}</p>
                            ) : (
                                <p className="font-mono text-stone-400">-</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CUERPO PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                    {/* COLUMNA IZQUIERDA: IMAGEN */}
                    <div className="bg-stone-100 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-stone-200 min-h-[400px]">
                        {productDB?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={productDB.imageUrl}
                                alt={productDB.name}
                                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <div className="text-stone-300 flex flex-col items-center">
                                <span className="text-6xl">📦</span>
                                <span className="mt-4 text-sm font-medium">Sin imagen</span>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: DETALLES */}
                    <div className="p-6 sm:p-8 flex flex-col gap-6">

                        {/* Descripción */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Descripción</h3>
                            <p className="text-stone-700 leading-relaxed text-lg">
                                {productDB?.description}
                            </p>
                        </div>

                        {/* Cantidad y Owner */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                <p className="text-xs font-bold text-stone-400 uppercase">Unidades del Lote</p>
                                <p className="text-2xl font-bold text-stone-800">{Number(productDB?.quantity)} uds.</p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                <p className="text-xs font-bold text-stone-400 uppercase">Dueño Actual</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-indigo-600 font-medium">
                                        {shortenAddress(productDB?.currentOwner)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* HASH Tecnico */}
                        <div className="mt-auto pt-6 border-t border-stone-100">
                            <p className="text-xs font-bold text-stone-400 uppercase mb-2">Hash de Integridad (Blockchain)</p>
                            <div className="flex items-center gap-2 bg-stone-50 p-3 rounded border border-stone-200">
                                <code className="text-xs text-stone-600 break-all flex-1 font-mono">
                                    {productDB?.characterizationHash}
                                </code>
                                <button
                                    onClick={() => handleCopy(productDB?.characterizationHash ? productDB.characterizationHash : '')}
                                    className="p-2 hover:bg-stone-200 rounded text-stone-500"
                                    title="Copiar"
                                >
                                    📋
                                </button>
                            </div>
                        </div>

                        {/* ACCIONES (Solo dueño) */}
                        {isOwner && productDB.active && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <button
                                    onClick={() => setIsTransferOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    Transferir Propiedad
                                </button>
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 py-3 px-4 rounded-xl font-medium transition-all"
                                >
                                    Borrar Producto
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <ProductHistory events={eventListDB} />
            </div>

            {/* MODALES OCULTOS */}
            <TransferProductModal
                isOpen={isTransferOpen}
                onClose={() => setIsTransferOpen(false)}
                preFilledId={productDB.blockchainId.toString()}
                onSuccess={(data) => {
                    const transferData = data as TransferSuccessData;
                    const optimisticEvent = createOptimisticEvent(
                        productDB.blockchainId,
                        transferData?.txHash,
                        productDB?.characterizationHash || "0xHashNoDisponible",
                        'TRANSFERRED',
                        productDB.currentOwner,
                        transferData?.newOwner
                    );
                    // Llamamos al padre (ProductView)
                    onDataUpdate(transferData.newOwner, optimisticEvent);
                    setIsTransferOpen(false);
                }}
            />
            <DeleteProductModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                preFilledId={productDB.blockchainId.toString()}
                onSuccess={(data) => {
                    const deleteData = data as DeleteSuccessData;

                    const optimisticEvent = createOptimisticEvent(
                        productDB.blockchainId,
                        deleteData.txHash,
                        productDB?.characterizationHash || "0xHashNoDisponible",
                        'DELETED',
                        productDB.currentOwner,
                        productDB.currentOwner
                    );
                    onDataUpdate(productDB.currentOwner, optimisticEvent);
                    setIsDeleteOpen(false);
                }}
            />
        </div>
    )
}