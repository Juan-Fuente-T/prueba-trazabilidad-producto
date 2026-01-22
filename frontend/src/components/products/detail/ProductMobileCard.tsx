import Link from 'next/link'
import { useState } from 'react'
import { getActorInfo } from '@/utils/roleUtils'
import { ProductUI } from '@/types/product'
// import Image from "next/image"
import { getSyncBadgeStyles } from '@/utils/eventUiUtils'

export default function ProductMobileCard({ product }: { product: ProductUI}) {
    const info = getActorInfo(product.currentOwner);
    const [showImage, setShowImage] = useState(false);

    const isPending = product.isVerified === false || !!product.pendingTxHash;
    const badgeStyles = getSyncBadgeStyles(isPending);

    return (
        <div className="w-full bg-white p-3 rounded-lg border border-acero-200 shadow-sm flex flex-col gap-2 mb-3">

            {/* 1. CABECERA: ID y ESTADO */}
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-industrial text-xs bg-industrial/5 px-1.5 py-0.5 rounded border border-industrial/10">
                        #{product.blockchainId}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${info.color}`}>
                        {info.status}
                    </span>
                    {/* Badge de Sincronización en la cabecera */}
                    {isPending && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeStyles}`}>
                            <svg className="animate-spin h-2.5 w-2.5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Sync
                        </span>
                    )}
                </div>

                {/* Botón Acción */}
                <Link
                    href={`/products/${product.blockchainId}`}
                    className="p-1.5 bg-acero-50 rounded border border-acero-200 text-acero-500 hover:text-industrial"
                >
                    ⚙️
                </Link>
            </div>

            {/* 2. CUERPO PRINCIPAL (Imagen + Texto expandido) */}
            <div className="flex gap-3 w-full items-start">

                {/* Imagen */}
                <div
                    className="h-16 w-16 bg-acero-50 border border-acero-200 rounded-md overflow-hidden flex-shrink-0 cursor-zoom-in"
                    onClick={() => setShowImage(true)}
                >
                    {product.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={product.imageUrl} alt="" className="h-auto w-full object-contain" />
                    ) : (
                        <div className="h-auto w-full flex items-center justify-center text-lg">📦</div>
                    )}
                </div>

                {/* Texto */}
                <div className="flex flex-col justify-center flex-1 min-w-0 h-full">
                    <div className="flex justify-between items-start w-full">
                        <h3 className="font-bold text-acero-800 text-sm truncate pr-2 w-full">
                            {product.name}
                        </h3>
                    </div>

                    <p className="text-[11px] text-acero-500 line-clamp-1 mb-1">
                        {product.description}
                    </p>

                    {/* Fila de datos técnicos */}
                    <div className="flex items-center justify-between text-[11px] text-acero-600 font-mono mt-auto">
                        <span>Vol: <strong>{Number(product.quantity).toLocaleString()}</strong></span>

                        {/* El custodio, alineado a la derecha */}
                        <div className="flex items-center gap-1 text-[10px] text-acero-400">
                            <span>📍</span>
                            <span className="truncate pr-2 max-w-[200px]">{info.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX Imagen*/}
            {showImage && product.imageUrl && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setShowImage(false)}
                >
                    {/* <Image src={product.imageUrl} alt="" width={300} height={180} className="object-contain" /> */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imageUrl} alt="Zoom" className="max-w-full max-h-full object-contain rounded shadow-2xl" />
                    <button className="absolute top-4 right-4 text-white text-xl font-bold p-4">✕</button>
                </div>
            )}
        </div>
    )
}