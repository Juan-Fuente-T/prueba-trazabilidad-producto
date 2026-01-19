
import { ProductDB } from '@/types/product'
import ProductTableRow from './ProductTableRow'
import ProductMobileCard from './ProductMobileCard'

interface ProductGridProps {
    products: ProductDB[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-acero-200 rounded-lg bg-acero-50/50">
                <p className="text-acero-400 text-4xl mb-2">∅</p>
                <p className="text-acero-500 font-bold text-sm uppercase tracking-wide">Inventario Vacío</p>
                <p className="text-acero-400 text-xs">No hay lotes registrados actualmente.</p>
            </div>
        )
    }
    return (
        <div className="bg-white rounded-lg border border-acero-200 shadow-sm overflow-hidden">
            {/* 1. VISTA MÓVIL (Visible solo hasta 'md') */}
            <div className="block md:hidden">
                {products.map((product) => (
                    <ProductMobileCard key={product.blockchainId} product={product} />
                ))}
            </div>
            {/* 2. VISTA ESCRITORIO (Tabla visible desde 'md' en adelante) */}
            <div className="hidden md:block bg-white rounded-lg border border-acero-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* CABECERA */}
                        <thead className="bg-acero-50 text-acero-500 text-[10px] uppercase font-bold tracking-wider border-b border-acero-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Ref / Lote</th>
                                <th className="px-4 py-3 font-semibold">Ficha Técnica</th>
                                <th className="px-4 py-3 font-semibold text-center">Volumen</th>
                                <th className="px-4 py-3 font-semibold">Custodio</th>
                                <th className="px-4 py-3 font-semibold text-center">Estado</th>
                                <th className="px-4 py-3 font-semibold text-right">Control</th>
                            </tr>
                        </thead>

                        {/* CUERPO: Aquí llamamos al componente modular */}
                        <tbody>
                            {products.map((product) => (
                                <ProductTableRow
                                    key={product.blockchainId}
                                    product={product}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Footer de tabla con conteo rápido) */}
                <div className="bg-acero-50 px-4 py-2 border-t border-acero-200 text-[10px] text-acero-400 text-right font-mono">
                    REGISTROS MOSTRADOS: {products.length}
                </div>
            </div>
        </div>
    )
}