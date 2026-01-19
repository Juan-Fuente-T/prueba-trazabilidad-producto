import { ProductDB } from '@/types/product'
import Link from 'next/link'
import { useState } from 'react'
import { getActorInfo } from '@/utils/roleUtils'

export default function ProductTableRow({ product }: { product: ProductDB }) {
    const info = getActorInfo(product.currentOwner);
    const [showImage, setShowImage] = useState(false);
    // Lógica visual simple
    const shortOwner = typeof product.currentOwner === 'string'
        ? `${product.currentOwner.substring(0, 6)}...${product.currentOwner.slice(-4)}`
        : '...'

    return (
        <>
            <tr className="hover:bg-acero-50 transition-colors group border-b border-acero-100 last:border-0">

                {/* 1. REF / IMAGEN */}
                <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-12 w-12 bg-white border border-acero-200 rounded p-0.5 flex-shrink-0 cursor-zoom-in hover:border-industrial transition-colors shadow-sm"
                            onClick={() => setShowImage(true)}
                        >
                            {product.imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={product.imageUrl} alt="" className="h-full w-full object-contain rounded-sm" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs">📦</div>
                            )}
                        </div>
                        <span className="font-mono font-bold text-industrial text-xs bg-industrial/5 px-2 py-1 rounded border border-industrial/10">
                            #{product.blockchainId}
                        </span>
                    </div>
                </td>

                {/* 2. DESCRIPCIÓN TÉCNICA */}
                <td className="px-4 py-3 align-middle">
                    <p className="font-bold text-acero-800 text-sm">{product.name}</p>
                    <p className="text-[11px] text-acero-500 truncate max-w-[180px]">
                        {product.description}
                    </p>
                </td>

                {/* 3. UNIDADES (Mono) */}
                <td className="px-4 py-3 align-middle text-center">
                    <span className="font-mono text-acero-700 text-xs font-medium">
                        {Number(product.quantity).toLocaleString()}
                    </span>
                </td>

                {/* 4. CUSTODIO */}
                <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-acero-700">{info.role}</span>
                        <span className="text-[10px] font-mono text-acero-400 truncate w-24">
                            {shortOwner}
                        </span>
                    </div>
                </td>

                {/* 5. ESTADO (Activo / Inactivo) */}
                <td className="px-4 py-3 align-middle text-center">
                    {product.active ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${info.color}`}>
                            {info.status}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
                            ✖ Finalizado / Borrado
                        </span>
                    )}
                </td>

                {/* 6. ACCIÓN */}
                <td className="px-4 py-3 align-middle text-right">
                    <Link
                        href={`/products/${product.blockchainId}`}
                        className="inline-block text-acero-500 hover:text-industrial hover:bg-white border border-transparent hover:border-acero-200 p-1.5 rounded transition-all"
                        title="Gestionar Lote"
                    >
                        ⚙️
                    </Link>
                </td>
            </tr>
            {/* LIGHTBOX MODAL (Portal simple) */}
            {showImage && product.imageUrl && (
                <tr className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8" onClick={() => setShowImage(false)}>
                    <td className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.imageUrl}
                            alt="Zoom"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl pointer-events-auto"
                        />
                        <button className="absolute top-5 right-5 text-white text-2xl font-bold bg-black/50 w-10 h-10 rounded-full pointer-events-auto hover:bg-white/20">✕</button>
                    </td>
                </tr>
            )}
        </>
    )
}