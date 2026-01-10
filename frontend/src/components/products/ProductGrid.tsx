// src/components/products/ProductGrid.tsx
import { ProductDB } from '@/types/product'
import ProductSummaryCard from './ProductSummaryCard'

interface ProductGridProps {
    products: ProductDB[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                <p className="text-4xl mb-2">🕵️‍♂️</p>
                <p className="text-stone-600 font-medium">No hay coincidencias</p>
                <p className="text-stone-400 text-sm">Intenta con otro término</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductSummaryCard key={product.blockchainId} product={product} />
            ))}
        </div>
    )
}