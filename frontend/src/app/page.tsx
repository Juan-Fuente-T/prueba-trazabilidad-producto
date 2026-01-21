// src/app/page.tsx
'use client'
import ProductList from '@/components/products/listing/ProductList'
import QuickOperationsPanel from '@/components/products/QuickOperationsPanel'
import RegisterProductModal from '@/components/products/modals/RegisterProductModal'
import GenericActionController from '@/components/ui/GenericActionController'
import { useProductDashboardLogic } from '@/hooks/orchestration/useProductDashboardLogic'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()
  const {
    productListDB,
    optimisticActions,
    refecth,
    isLoading,
    error
  } = useProductDashboardLogic()

  return (
    <main className="min-h-screen bg-stone-50 ">
      <div className="container mx-auto px-4 py-8">
        {/* CABECERA*/}
        <div className="flex  flex-col justify-between items-end">
          <h1 className="text-lg sm:text-2xl font-bold mb-12 mt-8 text-center w-full">
            Prueba de concepto para trazabilidad de producto en Blockchain (Java / Spring / Next / Typescript / Solidity)
          </h1>
          {/* 2. BARRA SUPERIOR: BOTÓN DE CREAR */}
          <div className="flex justify-between items-center mx-auto mb-8 sm:mb-12 w-full">
            <div>
              <h1 className="text-3xl font-bold text-stone-800">Inventario</h1>
              <p className="text-stone-500">Panel de Control</p>
            </div>
            <div className="flex flex-col items-center mb-6">
              {isConnected ? (
                <GenericActionController
                  buttonText="＋ Nuevo Lote"
                  buttonColor="bg-emerald-600 hover:bg-emerald-700"
                  ModalComponent={RegisterProductModal}
                  disabled={!isConnected}
                  preFilledId="" // Relleno para cumplir con la interfaz
                  modalProps={{
                    onOptimisticCreate: optimisticActions.create,
                    onRollback: optimisticActions.rollback
                  }}
                  onSuccess={() => {
                    // espera 2 segundos a que el Backend indexe y RECARGA la lista.
                    setTimeout(() => {
                      refecth()
                    }, 2000)
                  }}
                />
              ) : (
                <span className="text-stone-400 text-sm md:text-md font-semibold italic mt-2 px-2 py-1 text-wrap bg-stone-100 rounded-md">
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
          <h2 className="text-lg font-bold text-stone-700 mb-4">Catálogo de Activos</h2>
          {isLoading ? (
            <p className="text-center py-10 text-stone-500">Cargando...</p>
          ) : (
            <ProductList products={productListDB || []} />
          )}
        </div>
      </div>
    </main>
  )
}