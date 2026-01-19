import { getRoleName } from '@/utils/roleUtils'
import { shortenAddress } from '@/utils/formatters'
import { ProductDB, Product } from '@/types/product'

interface ProductInfoCardProps {
    productId: string
    product: Product | undefined | null
    productDB: ProductDB | null
    loadingDB: boolean
    isLoadingBlockchain: boolean
    isOwner: boolean
    variant?: 'default' | 'danger' // 'default' para asignar, 'danger' para bajas
    minHeight?: string // Para controlar el salto de layout
}

export default function ProductInfoCard({
    productId,
    product,
    productDB,
    loadingDB,
    isLoadingBlockchain,
    isOwner,
    variant = 'default',
    minHeight = '130px'
}: ProductInfoCardProps) {

    // 1. Define estilos según la variante
    const isDanger = variant === 'danger'

    const containerClasses = isDanger
        ? "bg-rose-50 border-rose-100 text-rose-800"
        : "bg-indigo-50 border-indigo-100 text-indigo-900"

    const titleClasses = isDanger ? "text-rose-800" : "text-indigo-800"

    // Calcula el rol aquí para no ensuciar el padre
    const roleLabel = product ? getRoleName(product.currentOwner) : "Desconocido"

    return (
        <div
            className="flex items-center justify-center border border-stone-200 rounded-md transition-all"
            style={{ minHeight: minHeight }}
        >
            {/* CASO A: TODO CARGADO Y CORRECTO */}
            {productId && product && (
                <div className={`w-full border rounded p-4 text-sm shadow-sm ${containerClasses}`}>

                    {/* Cabecera especial para modo PELIGRO */}
                    {isDanger && (
                        <p className={`font-bold border-b pb-2 mb-2 ${isDanger ? 'border-rose-200' : 'border-indigo-200'} ${titleClasses}`}>
                            ⚠️ Vas a eliminar permanentemente:
                        </p>
                    )}

                    {/* <div className="grid grid-cols-[80px_1fr] gap-y-1 text-acero-700 no-wrap w-full border"> */}
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-acero-700 w-full border">
                        <span className="font-semibold text-acero-500 whitespace-nowrap">Referencia:</span>
                        <span className="font-bold text-acero-900">
                            {loadingDB ? "Cargando..." : productDB?.name || "(Desconocido)"}
                        </span>

                        <span className="font-semibold text-acero-500">ID:</span>
                        <span>{productId}</span>

                        <span className="font-semibold text-acero-500">Custodio:</span>
                        <span>{roleLabel}</span>

                        <span className="font-semibold text-acero-500">ID de Custodio:</span>
                        <span className="font-mono text-xs pt-0.5">
                            {shortenAddress(product.currentOwner)}
                        </span>
                    </div>

                    {/* Aviso de NO OWNER */}
                    {!isOwner && (
                        <div className="mt-3 bg-red-100 text-red-700 p-2 rounded text-center text-xs font-bold border border-red-200">
                            ⛔ NO ERES EL CUSTODIO. ACCESO DENEGADO.
                        </div>
                    )}
                </div>
            )}

            {/* CASO B: NO ENCONTRADO EN BLOCKCHAIN */}
            {productId && !product && !isLoadingBlockchain && (
                <div className="text-center p-4">
                    <p className="text-red-500 text-lg font-bold bg-red-50 px-4 py-2 rounded-md border border-red-100">
                        ❌ El producto ID {productId} no existe
                    </p>
                </div>
            )}

            {/* CASO C: ESTADO INICIAL (VACÍO) */}
            {!productId && (
                <p className="text-acero-400 text-sm italic">Introduce un ID para ver detalles...</p>
            )}
        </div>
    )
}