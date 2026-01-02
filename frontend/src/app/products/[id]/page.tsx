import { getProductFromDB } from '@/services/getProductFromDB' // Importa la función de arriba
import ProductDetailCard from '@/components/products/ProductDetailCard'
import Header from '@/components/layout/Header'
import ProductNavigation from '@/components/products/ProductNavigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id: productId } = await params;

    const numericId = Number(productId)
    const product = await getProductFromDB(productId)

    if (!product) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ProductNavigation currentId={numericId} />

                    <div className="text-center mt-20">
                        <h1 className="text-2xl font-bold text-stone-800">Error 404</h1>
                        <p className="text-stone-600 mb-4">No se ha podido cargar el producto #{numericId}</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <main className="min-h-screen bg-stone-50 pb-10 mt-22">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <ProductNavigation currentId={numericId} />
                <ProductDetailCard product={product} />
            </div>
        </main>
    )
}