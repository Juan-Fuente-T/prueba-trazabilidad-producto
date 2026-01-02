'use client'
import { useState } from 'react'
import { ProductDB } from '@/types/product'
import ProductSearchBar from './ProductSearchBar'
import ProductGrid from './ProductGrid'

interface ProductListProps {
    products: ProductDB[]
}

export default function ProductList({ products }: ProductListProps) {
    const [searchTerm, setSearchTerm] = useState('')

    // Lógica de Filtrado "Híbrida" (ID o Nombre)
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(term)
        const matchesId = product.blockchainId.toString().includes(term)

        return matchesName || matchesId
    })

    return (
        <div>
            <ProductSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalProducts={filteredProducts.length}
            />
            <ProductGrid products={filteredProducts} />
        </div>
    )
}