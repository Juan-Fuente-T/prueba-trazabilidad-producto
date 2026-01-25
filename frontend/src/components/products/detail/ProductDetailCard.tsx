'use client'
import { useEffect } from 'react'; // Ya no necesitas useState aquí
import { useAccount } from 'wagmi';
import { Event } from '@/types/events';
import { ProductUI } from '@/types/product';
import ProductHistory from '@/components/products/history/ProductHistory';
import ProductAnalytics from '../analytics/ProductAnalytics';
import { ProductKeyMetrics } from './ProductKeyMetrics';
import { ProductDetailHeader } from './ProductDetailHeader';
import { ProductActionsControl } from './ProductActionsControl';
import { useProductMetrics } from '@/hooks/blockchain/useProductMetrics';
import { getRoleName } from '@/utils/roleUtils';

interface ProductDetailCardProps {
    productDB: ProductUI;
    eventListDB: Event[];
    onDataUpdate: (newOwner?: string, newEvent?: Event) => void;
    onRefetch: () => void;
}

export default function ProductDetailCard({ productDB, eventListDB, onDataUpdate, onRefetch }: ProductDetailCardProps) {
    const { address } = useAccount();
    const { activeProductsQuantity, updateActiveProductsQuantity } = useProductMetrics();

    // Lógica derivada
    const isPending = productDB.isVerified === false || !!productDB.pendingTxHash;
    const isOwner = address && productDB?.currentOwner && address.toLowerCase() === productDB?.currentOwner.toLowerCase();
    const actorRole = getRoleName(productDB.currentOwner);

    useEffect(() => {
        updateActiveProductsQuantity()
    }, [updateActiveProductsQuantity])

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up px-4">
            <div className="bg-white rounded-lg shadow-sm border border-acero-200 overflow-hidden">

                {/* HEADER DE PRODUCTO (Azul si eres owner)  */}
                <ProductDetailHeader
                    product={productDB}
                    isOwner={!!isOwner}
                    actorRole={actorRole}
                    isPending={isPending}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* COLUMNA IZQUIERDA: IMAGEN (1/3 del ancho) (Podría extraerse a ProductImage) */}
                    <div className="lg:col-span-1 bg-acero-50 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-acero-200 min-h-[200px] lg:min-h-[400px]">
                        {productDB?.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={productDB.imageUrl}
                                alt={productDB.name}
                                className="max-w-full min-h-[200px] lg:min-h-[400px] object-contain rounded border border-acero-200 shadow-sm bg-white"
                            />
                        ) : (
                            <div className="text-acero-300 flex flex-col items-center">
                                <span className="text-5xl">📦</span>
                                <span className="mt-4 text-xs font-mono uppercase">Sin Imagen Técnica</span>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: DATOS */}
                        <div className="lg:col-span-2 p-2 border-b border-acero-200 flex flex-col gap-4">

                            {/* Título y Descripción */}
                            <div className='p-2'>
                                <h2 className="text-lg font-bold text-acero-800">{productDB?.name}</h2>
                                <p className="text-acero-600 text-sm mt-1 line-clamp-2">{productDB?.description}</p>
                            </div>

                            <div className="bg-acero-50/50 p-4 rounded border border-acero-200 w-full flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                                {/* 1. MÉTRICAS (Izquierda) */}
                                <div className="flex-1 min-w-0">
                                    <ProductKeyMetrics productDB={productDB} />
                                </div>

                                {/* BOTONES (Derecha) */}
                                {isOwner && productDB.active && (
                                    <div className="w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-acero-200 lg:border-none">
                                        <ProductActionsControl
                                            product={productDB}
                                            onDataUpdate={onDataUpdate}
                                            onRefetch={onRefetch}
                                        />
                                    </div>
                                )}
                        </div>

                        {/* ANALYTICS */}
                        <div className="p-6 bg-acero-50/30 flex-1">
                            <h3 className="text-xs font-bold text-acero-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                📈 Métricas de Trazabilidad
                            </h3>
                            <ProductAnalytics activeProductsQuantity={activeProductsQuantity} events={eventListDB} />
                        </div>
                    </div>
                </div>

                {/* HISTORIAL - Flujo visual*/}
                <div className="border-t border-acero-200">
                    <ProductHistory events={eventListDB} />
                </div>
            </div>
        </div>
    );
}