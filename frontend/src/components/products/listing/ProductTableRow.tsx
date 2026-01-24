import { ProductUI } from '@/types/product'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getActorInfo } from '@/utils/roleUtils'
import { getSyncBadgeStyles } from '@/utils/eventUiUtils'

export default function ProductTableRow({ product }: { product: ProductUI }) {
    const [showImage, setShowImage] = useState(false);
    const router = useRouter()
    const info = getActorInfo(product.currentOwner);

    const isPending = product.isVerified === false || !!product.pendingTxHash;
    const badgeStyles = getSyncBadgeStyles(isPending);

    // Función para navegar a detalle de lote
    const handleRowClick = (e: React.MouseEvent) => {
        // Evita que se dispare si se hace clic en un botón de acción específico dentro de la fila
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
            return;
        }
        router.push(`/products/${product.blockchainId}`);
    }

    const shortOwner = typeof product.currentOwner === 'string'
        ? `${product.currentOwner.substring(0, 6)}...${product.currentOwner.slice(-4)}`
        : '...'

    return (
        <>
            <tr
                onClick={handleRowClick}
                className="hover:bg-acero-50 transition-colors group border-b border-acero-300 last:border-0 cursor-pointer"
            >
                {/* 1. REF / IMAGEN */}
                <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-12 w-12 bg-white border border-acero-200 rounded p-0.5 flex-shrink-0 cursor-zoom-in hover:border-industrial transition-colors shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowImage(true);
                            }}
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
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                        {product.active ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${info.color}`}>
                                {info.status}
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
                                ✖ Finalizado / Borrado
                            </span>
                        )}
                        {/* Badge de Sincronización */}
                        {isPending && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider animate-pulse ${badgeStyles}`}>
                                <svg className="animate-spin h-2.5 w-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Verificando
                            </span>
                        )}
                    </div>
                </td>

                {/* 6. ACCIÓN */}
                <td className="px-4 py-3 align-middle text-right">
                    <Link
                        onClick={(e) => e.stopPropagation()}
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
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
                    onClick={() => setShowImage(false)}
                >
                    <div className="absolute inset-0 relative flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.imageUrl}
                            alt="Zoom"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl pointer-events-auto"
                        />
                        <div className="absolute top-5 right-5 z-10">
                            <button className="text-white text-2xl font-bold bg-black/50 w-10 h-10 rounded-full hover:bg-black/80 hover:scale-105 transition-transform"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowImage(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}