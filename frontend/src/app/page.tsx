'use client'

import Header from "@/components/layout/Header";
import { useAccount } from "wagmi";
import ProductSearch from "@/components/products/ProductSearch";
import Footer from "@/components/layout/Footer";
import OperationsPanel from "@/components/products/OperationsPanel";
import ProductList from "@/components/products/ProductList";
import useGetProductListFromDB from "@/hooks/useGetProductListFromDB";

export default function Home() {
  const { isConnected } = useAccount();
  const {productListDB} = useGetProductListFromDB();

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-stone-50">
      <Header />
      <main className="flex-1 flex flex-col w-full px-4 sm:px-6 md:px-8 sm:py-12 py-8 bg-stone-50">

        {/* SECCIÓN 1: BUSCADOR */}
        <section className="w-full mx-auto flex gap-4 items-center flex-col max-w-5xl mb-8">
          <div className="flex justify-between items-center mx-auto mb-8 sm:mb-12 w-full">
            <h1 className="text-lg sm:text-xl font-semibold mb-4 text-center w-full">
              Prueba técnica para trazabilidad de producto en Blockchain con Next y Solidity
            </h1>
          </div>

          <div className="mx-auto w-full">
            <ProductSearch />
          </div>
        </section>

        {/* SECCIÓN 2: GESTIÓN */}
        {isConnected && (
          <>
          <OperationsPanel/>
          <ProductList products={productListDB}/>
          </>
          )}

        {/* SECCIÓN 3: NO CONECTADO */}
        {!isConnected && (
          <div className="w-full mx-auto flex flex-col items-center justify-center max-w-5xl p-10 border-2 border-dashed border-stone-300 rounded-xl bg-stone-100">
            <p className="text-lg font-medium text-stone-600 mb-2">🔒 Acceso Restringido</p>
            <p className="text-stone-500">Conecta tu wallet en Sepolia para continuar.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}