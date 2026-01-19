'use client'
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import TransferProductModal from '@/components/products/modals/TransferProductModal';
import DeleteProductModal from '@/components/products/modals/DeleteProductModal';
import { Event } from '@/types/events';
import { TransferSuccessData, DeleteSuccessData } from '@/types/operations';
import { ProductDB } from '@/types/product';
import ProductHistory from '@/components/products/history/ProductHistory';
import { shortenAddress, formatDate } from '@/utils/formatters';
import { getRoleName } from '@/utils/roleUtils';
import { createOptimisticEvent } from '@/utils/optimisticFactory';
import ProductAnalytics from '../analytics/ProductAnalytics';
import { useProductMetrics } from '@/hooks/blockchain/useProductMetrics';

interface ProductDetailProps {
    productDB: ProductDB;
    eventListDB: Event[];
    onDataUpdate: (newOwner?: string, newEvent?: Event) => void;
}

export default function ProductDetailCard({ productDB, eventListDB, onDataUpdate }: ProductDetailProps) {
    const { address } = useAccount();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { activeProductsQuantity, updateActiveProductsQuantity } = useProductMetrics();

    // Verifica si es el dueño comparando direcciones
    const isOwner = address && productDB?.currentOwner &&
        address.toLowerCase() === productDB?.currentOwner.toLowerCase();
    const actorRole = getRoleName(productDB.currentOwner);

    useEffect(() => {
        updateActiveProductsQuantity()
    }, [updateActiveProductsQuantity])

    const handleCopy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => alert("Hash copiado!"));
        }
    }

    // GRID DE 2 COLUMNAS (IZQ: IMAGEN, DER: DATOS+GRÁFICOS)
    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up px-4">

            {/* TARJETA PRINCIPAL */}
            <div className="bg-white rounded-lg shadow-sm border border-acero-200 overflow-hidden">

                {/* ID y ESTADO (Compacto) */}
                <div className={`p-4 border-b border-acero-200 flex justify-between items-center ${isOwner ? 'bg-acero-900 text-white' : 'bg-acero-50 text-acero-900'}`}>
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold font-mono tracking-tight">
                            Lote #{productDB?.blockchainId}
                        </h1>
                        {/* Badges de Estado y Rol */}
                        <div className="flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${productDB?.active ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                } ${isOwner ? 'bg-white/10 text-emerald-300 border-white/20' : ''}`}>
                                {productDB?.active ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${isOwner ? 'bg-white/10 text-acero-300 border-white/20' : 'bg-acero-200/50 text-acero-600 border-acero-200'
                                }`}>
                                {actorRole}
                            </span>
                        </div>
                    </div>
                    {/* Fecha (Más pequeña) */}
                    <div className={`text-right text-[10px] font-mono ${isOwner ? 'text-acero-400' : 'text-acero-500'}`}>
                        <span className="opacity-70 mr-2">REGISTRO:</span>
                        {productDB?.timestamp ? formatDate(BigInt(productDB.timestamp)) : '-'}
                    </div>
                </div>

                {/* CUERPO DIVIDIDO EN 2: IMAGEN (IZQ) - DATOS (DER) */}
                <div className="grid grid-cols-1 lg:grid-cols-3">

                    {/* COLUMNA IZQUIERDA: IMAGEN (1/3 del ancho) */}
                    <div className="lg:col-span-1 bg-acero-50 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-acero-200 min-h-[400px]">
                        {productDB?.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={productDB.imageUrl}
                                alt={productDB.name}
                                className="max-w-full max-h-[350px] object-contain rounded border border-acero-200 shadow-sm bg-white"
                            />
                        ) : (
                            <div className="text-acero-300 flex flex-col items-center">
                                <span className="text-5xl">📦</span>
                                <span className="mt-4 text-xs font-mono uppercase">Sin Imagen Técnica</span>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: DATOS Y GRÁFICOS (2/3 del ancho) */}
                    <div className="lg:col-span-2 flex flex-col">

                        {/* 1. DATOS TÉCNICOS COMPACTOS (Panel Superior) */}
                        <div className="p-6 border-b border-acero-200 flex flex-col gap-4 ">

                            {/* Nombre y Descripción */}
                            <div>
                                <h2 className="text-lg font-bold text-acero-800">{productDB?.name}</h2>
                                <p className="text-acero-600 text-sm mt-1 line-clamp-2">
                                    {productDB?.description}
                                </p>
                            </div>

                            {/* KPIs: Cantidad, Custodio y Hash (Todo en una fila) */}
                            <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center'>
                                <div className="grid grid-cols-3 w-full gap-4 bg-acero-50/50 p-3 rounded border border-acero-200 flex-1 w-full">
                                    {/* Volumen */}
                                    <div>
                                        <p className="text-[10px] font-bold text-acero-400 uppercase">Volumen</p>
                                        <p className="text-base font-mono font-bold text-acero-800">
                                            {Number(productDB?.quantity).toLocaleString()} <span className="text-xs font-sans font-normal text-acero-500">uds.</span>
                                        </p>
                                    </div>
                                    {/* Custodio */}
                                    <div>
                                        <p className="text-[10px] font-bold text-acero-400 uppercase">Custodia</p>
                                        <p className="text-xs font-mono font-bold text-acero-700 truncate" title={productDB?.currentOwner}>
                                            {shortenAddress(productDB?.currentOwner)}
                                        </p>
                                    </div>
                                    {/* Hash (Truncado y con botón copy) */}
                                    <div>
                                        <p className="text-[10px] font-bold text-acero-400 uppercase flex items-center gap-1">
                                            Huella Digital
                                            <button onClick={() => handleCopy(productDB?.characterizationHash || '')} title="Copiar" className="hover:text-industrial">📋</button>
                                        </p>
                                        <code className="text-xs font-mono text-acero-600 bg-white px-1 py-0.5 rounded border border-acero-200 truncate block" title={productDB?.characterizationHash}>
                                            {shortenAddress(productDB?.characterizationHash)}
                                        </code>
                                    </div>
                                </div>

                                {/* ACCIONES (Botones) */}
                                {isOwner && productDB.active && (
                                    <div className="flex w-full gap-3 w-full md:w-auto md:flex-col shrink-0">
                                        <button
                                            onClick={() => setIsTransferOpen(true)}
                                            className="flex-1 md:max-w-[120px] bg-industrial hover:bg-industrial-dark text-white py-2 px-3 rounded text-xs font-bold shadow-sm transition-all"
                                        >
                                            🔄 Asignar
                                        </button>
                                        <button
                                            onClick={() => setIsDeleteOpen(true)}
                                            className="flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 px-3 rounded text-xs font-bold transition-all"
                                        >
                                            🗑️ Baja
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. SECCIÓN GRÁFICOS (Panel Inferior) */}
                        <div className="p-6 bg-acero-50/30 flex-1">
                            <h3 className="text-xs font-bold text-acero-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                📈 Métricas de Trazabilidad
                            </h3>
                            <ProductAnalytics
                                activeProductsQuantity={activeProductsQuantity}
                                events={eventListDB}
                            />
                        </div>
                    </div>
                </div>

                {/* HISTORIAL (Abajo a todo el ancho) */}
                <div className="border-t border-acero-200">
                    <ProductHistory events={eventListDB} />
                </div>
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