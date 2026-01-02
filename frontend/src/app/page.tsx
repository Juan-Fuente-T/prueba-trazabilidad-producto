// src/app/page.tsx
'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import ProductList from '@/components/products/ProductList'
import QuickOperationsPanel from '@/components/products/QuickOperationsPanel'
import RegisterProductModal from '@/components/products/modals/RegisterProductModal'
import GenericActionController from '@/components/ui/GenericActionController'
import useGetProductListFromDB from '@/hooks/useGetProductListFromDB'

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const { productListDB, isLoading, error } = useGetProductListFromDB()

  return (
    <main className="min-h-screen bg-stone-50 pb-20 mt-8 md:mt-20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* CABECERA*/}
        <div className="flex  flex-col justify-between items-end">
          <h1 className="text-lg sm:text-2xl font-bold mb-12 mt-8 text-center w-full">
            Prueba de concepto para trazabilidad de producto en Blockchain (con Next y Solidity)
          </h1>
          {/* 2. BARRA SUPERIOR: BOTÓN DE CREAR */}
          <div className="flex justify-between items-center mx-auto mb-8 sm:mb-12 w-full">
            <div>
              <h1 className="text-3xl font-bold text-stone-800">Inventario</h1>
              <p className="text-stone-500">Panel de Control</p>
            </div>
            {/* <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2"
            >
              ＋ Nuevo Producto
            </button> */}
            <GenericActionController
            buttonText="＋ Nuevo Producto"
                buttonColor="bg-emerald-600 hover:bg-emerald-700"
                ModalComponent={RegisterProductModal}
            />
          </div>
        </div>

        {/* ZONA DE OPERACIONES RÁPIDAS*/}
        <QuickOperationsPanel />

        {/* ZONA DE EXPLORACIÓN DE PRODUCTOS*/}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-stone-700 mb-4">Catálogo de Activos</h2>
          {isLoading ? (
            <p className="text-center py-10 text-stone-500">Cargando...</p>
          ) : (
            <ProductList products={productListDB || []} />
          )}
        </div>

      </div>

      <RegisterProductModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </main>
  )
}