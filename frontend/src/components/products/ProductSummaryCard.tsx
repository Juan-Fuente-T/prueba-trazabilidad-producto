import Link from 'next/link'
import { ProductDB } from '@/types/product'
import { shortenAddress } from '@/utils/formatters'

interface ProductSummaryCardProps {
    product: ProductDB
}

export default function ProductSummaryCard({ product }: ProductSummaryCardProps) {
    const isActive = product.active

    return (
        <Link href={`/products/${product.blockchainId}`} className="group block h-full">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">

                {/* 1. IMAGEN (Aspect Ratio 16:9 o cuadrado) */}
                <div className="relative aspect-video bg-stone-100 overflow-hidden">
                    {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-stone-300">
                            <span className="text-4xl">📦</span>
                        </div>
                    )}

                    {/* Badge de ID */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-mono font-bold text-stone-700 shadow-sm border border-stone-200">
                        #{product.blockchainId}
                    </div>
                </div>

                {/* 2. CUERPO */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                        </h3>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {product.description || "Sin descripción disponible."}
                    </p>

                    {/* 3. FOOTER (Owner y Estado) */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs mt-auto">
                        <div className="flex items-center gap-1.5 text-stone-500">
                            <span>👤</span>
                            <span className="font-mono bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                                {shortenAddress(product.currentOwner)}
                            </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] uppercase tracking-wide ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isActive ? 'Activo' : 'Eliminado'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}