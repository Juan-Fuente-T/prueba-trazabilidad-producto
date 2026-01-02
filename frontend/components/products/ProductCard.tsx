'use client'
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
// Asegúrate de que las rutas a tus modales sean correctas
import TransferProductModal from './modals/TransferProductModal';
import DeleteProductModal from './modals/DeleteProductModal';
import { Product } from '@/types/product'
import { shortenAddress } from '@/utils/formatters'

interface productCardProps {
    productId?: bigint;
    product: Product;
    onClose: () => void;
}

export default function ProductCard({ productId, product, onClose }: productCardProps) {
    const { address } = useAccount();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const isOwner = address && product.currentOwner && address.toLowerCase() === product.currentOwner.toLowerCase();

    // Formateo de fecha seguro para BigInt
    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    const handleCopy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(console.error);
        } else {
            // Fallback si no hay HTTPS (en local), para que no explote la app
            console.warn("Clipboard no disponible");
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden relative w-full max-w-4xl mx-auto my-6 animate-fade-in-up">

            {/* Header: Color Distinto si es o no Dueño */}
            <div className={`p-4 sm:p-6 flex justify-between items-start text-white ${isOwner ? 'bg-indigo-900' : 'bg-stone-600'}`}>
                <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                        {product.exists ? (
                            <span className="bg-emerald-500 text-[10px] sm:text-xs font-bold px-2 py-1 rounded text-white shadow-sm">
                                REGISTRADO
                            </span>
                        ) : (
                            <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded text-white">NO EXISTE</span>
                        )}

                        {isOwner && (
                            <span className="bg-amber-400 text-amber-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-sm border border-amber-500">
                                ⭐ TU PRODUCTO
                            </span>
                        )}

                        <h2 className="text-lg sm:text-2xl font-bold">Producto #{productId?.toString() || '??'}</h2>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-6">

                    {/* Fila de Datos: Cantidad y Fecha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-3 sm:p-4 rounded-lg border border-stone-100">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Cantidad</p>
                            <p className="text-lg sm:text-xl font-semibold text-stone-800">{product.quantity.toString()} <span className="text-sm font-normal text-stone-500">unidades</span></p>
                        </div>
                        <div className="bg-stone-50 p-3 sm:p-4 rounded-lg border border-stone-100">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Fecha Creación</p>
                            <p className="text-sm font-semibold text-stone-800 mt-1">{formatDate(product.timestamp)}</p>
                        </div>
                    </div>

                    {/* Fila de Datos: Propietario */}
                    <div className={`p-3 sm:p-4 rounded-lg border ${isOwner ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'}`}>
                        <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isOwner ? 'text-indigo-600' : 'text-blue-500'}`}>
                            {isOwner ? 'Eres el Propietario' : 'Propietario Actual'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono text-sm sm:text-base font-medium break-all text-stone-800">
                                {shortenAddress(product.currentOwner)}
                            </p>
                            <a
                                href={`https://sepolia.etherscan.io/address/${product.currentOwner}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline bg-white px-2 py-1 rounded border border-blue-100"
                            >
                                Ver en Etherscan ↗
                            </a>
                        </div>
                    </div>

                    {/* Fila de Datos: Hash */}
                    <div>
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Hash de caracterización de producto</p>
                        <div className="flex items-center gap-2 bg-stone-100 p-3 rounded border border-stone-200">
                            {/* break-all: Fundamental para que el hash parta la línea en pantallas estrechas */}
                            <span className="font-mono text-xs text-stone-600 break-all flex-1">
                                {product.characterizationHash}
                            </span>
                            <button
                                onClick={() => handleCopy(product.characterizationHash)}
                                className="text-stone-400 hover:text-stone-800 p-2 hover:bg-stone-200 rounded transition-colors"
                                title="Copiar Hash"
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    {/* 3. ACCIONES: Solo se renderizan si isOwner es true */}
                    {isOwner && (
                        <div className="mt-4 pt-4 border-t border-stone-200 animate-fade-in">
                            <p className="text-sm font-bold text-stone-700 mb-3">Gestión del Producto:</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsTransferOpen(true)}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    Transferir Propiedad
                                </button>
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    Borrar Producto
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Renderizado condicional de los Modales */}
            {isOwner && (
                <>
                    <TransferProductModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
                    <DeleteProductModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
                </>
            )}
        </div>
    )
}