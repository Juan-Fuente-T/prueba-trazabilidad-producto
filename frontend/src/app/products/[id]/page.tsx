import { getProductFromDB } from '@/services/getProductFromDB' // Importa la función de arriba
import ProductDetailCard from '@/components/products/ProductDetailCard'
import Header from '@/components/layout/Header'
import ProductNavigation from '@/components/products/ProductNavigation'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id: productId } = await params;

    const numericId = Number(productId)
    const product = await getProductFromDB(productId)

    if (!product) {
        return (
            <div className="min-h-screen bg-stone-50 mt-20">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ProductNavigation currentId={numericId} />

                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full">
                            {/* <h1 className="text-6xl mb-4">🤷‍♂️</h1> */}
                            <h2 className="text-2xl font-bold text-stone-800 mb-2">Producto no encontrado</h2>
                            <p className="text-stone-500 mb-6">
                                El producto <strong>#{numericId}</strong> no existe o no ha sido registrado aún.
                            </p>

                            {/* Botón extra de seguridad */}
                            <Link href="/" className="text-emerald-600 font-medium border border-emerald-600 rounded-md px-2 py-1.5 hover:underline ">
                                Ir al listado principal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <main className="min-h-screen bg-stone-50 pb-10 mt-20">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <ProductNavigation currentId={numericId} />
                <ProductDetailCard product={product} />
            </div>
        </main>
    )
}