import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

export const useProductMetrics = () => {
    // Obtiene el ID actual, para crear el nuevo producto en DB
    const { data: productIdData , isLoading: isLoadingProductId, refetch: updateProductId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'productId',
        query: {
            enabled: false, // APAGADO POR DEFECTO para evitar llamadas continuas
        }
    })

    // Obtiene el numero de productos activos
    const { data: activeProductsData, isLoading: isLoadingActiveProductsQuantity, refetch: updateActiveProductsQuantity } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'activeProducts',
        query: {
            enabled: false,
        }
    })

    const productId = productIdData ? Number(productIdData) : 0
    const activeProductsQuantity = activeProductsData ? Number(activeProductsData) : 0

    return {
        productId,
        isLoadingProductId,
        updateProductId,
        activeProductsQuantity,
        isLoadingActiveProductsQuantity,
        updateActiveProductsQuantity
    }
}