// src/app/page.tsx
'use client'
import ProductList from '@/components/products/listing/ProductList'
import QuickOperationsPanel from '@/components/products/QuickOperationsPanel'
import RegisterProductModal from '@/components/products/modals/RegisterProductModal'
import GenericActionController from '@/components/ui/GenericActionController'
import { useProductDashboardLogic } from '@/hooks/orchestration/useProductDashboardLogic'
import { useAccount } from 'wagmi'
import { ProductUI } from '@/types/product'

export default function Home() {
  const { isConnected } = useAccount()
  const {
    productListDB,
    optimisticActions,
    // refetch,
    isLoading,
    error
  } = useProductDashboardLogic()

  return (
    <main className="min-h-screen bg-acero-50 ">
      <div className="container mx-auto px-4 py-8">
        {/* CABECERA*/}
        <div className="flex  flex-col justify-between items-end">
          <div className="w-full border-b border-acero-200 pb-4 mt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-acero-800 tracking-tight">
              Sistema de Trazabilidad de Lotes
            </h1>
            <p className="text-acero-500 mt-1 text-sm">
              Gestión certificada de inventario y cadena de custodia.
            </p>
          </div>

          {/* 2. BARRA SUPERIOR: BOTÓN DE CREAR */}
          <div className="flex justify-between items-center mx-auto mt-4 mb-8 sm:mb-12 w-full">
            <div>
              <h1 className="text-3xl font-bold text-acero-800">Inventario</h1>
              <p className="text-acero-500">Panel de Control</p>
            </div>
            <div className="flex flex-col items-center mb-6">
              {isConnected ? (
                <GenericActionController
                  buttonText="＋ Nuevo Lote"
                  buttonColor="bg-emerald-600 hover:bg-emerald-700"
                  ModalComponent={RegisterProductModal}
                  disabled={!isConnected}
                  preFilledId="" // Relleno para cumplir con la interfaz
                  onSuccess={(data) => {
                    if (data && 'product' in data && 'txHash' in data) {
                      const payload = data as { product: ProductUI; txHash: string };
                      if (optimisticActions.attachHash) {
                        optimisticActions.attachHash(payload.product.blockchainId, payload.txHash);
                      }
                    }
                  }}
                  modalProps={{
                    // FASE OPTIMISTA: Pinta de inmediato
                    onOptimisticCreate: (product: ProductUI) => {
                      optimisticActions.create(product);
                    },
                    onRollback: optimisticActions.rollback
                  }}
                />
              ) : (
                <span className="text-acero-400 text-sm md:text-md font-semibold italic mt-2 px-2 py-1 text-wrap bg-acero-100 rounded-md">
                  Conéctate para operar
                </span>
              )
              }
            </div>
          </div>
        </div>

        {/* ZONA DE OPERACIONES RÁPIDAS*/}
        <QuickOperationsPanel actions={optimisticActions} />

        {/* ZONA DE EXPLORACIÓN DE PRODUCTOS*/}
        <div className="mt-8">
          {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>}
          <h2 className="text-lg font-bold text-acero-700 mb-4">Catálogo de Activos</h2>
          {isLoading ? (
            <p className="text-center py-10 text-acero-500">Cargando...</p>
          ) : (
            <ProductList products={productListDB || []} />
          )}
        </div>
      </div>
    </main>
  )
}