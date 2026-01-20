import ProductView from '@/components/products/detail/ProductView'
interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params
    return <ProductView productId={id} />
}