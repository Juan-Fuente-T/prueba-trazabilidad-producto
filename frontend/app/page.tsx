'use client'

import RegisterProductModal from "@/components/products/modals/RegisterProductModal";
import DeleteProductModal from "@/components/products/modals/DeleteProductModal";
import TransferProductModal from "@/components/products/modals/TransferProductModal";
import GenericActionController from "@/components/products/GenericActionController";
import Header from "@/components/layout/Header";
import { useAccount } from "wagmi";
import ProductSearch from "@/components/products/ProductSearch";
import EventNotifications from "@/components/events/EventNotifications";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { isConnected } = useAccount();

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
          <section className="w-full mx-auto bg-white max-w-5xl border border-stone-400 shadow-inner py-12 px-4 rounded">
            <div className=" mx-auto">

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-stone-300 flex-1"></div>
                <h3 className="text-stone-400 font-bold uppercase text-xs tracking-widest">Panel de Operaciones</h3>
                <div className="h-px bg-stone-300 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta 1: Registrar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Nuevo Ingreso</h2>
                  <GenericActionController
                    buttonText="Registrar Producto"
                    buttonColor="bg-emerald-600 hover:bg-emerald-700"
                    ModalComponent={RegisterProductModal}
                  />
                </div>

                {/* Tarjeta 2: Transferir */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Movimientos</h2>
                  <GenericActionController
                    buttonText="Transferir Producto"
                    buttonColor="bg-indigo-600 hover:bg-indigo-700"
                    ModalComponent={TransferProductModal}
                  />
                </div>

                {/* Tarjeta 3: Borrar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Zona de Peligro</h2>
                  <GenericActionController
                    buttonText="Eliminar Producto"
                    buttonColor="bg-rose-600 hover:bg-rose-700"
                    ModalComponent={DeleteProductModal}
                  />
                </div>
              </div>

              <EventNotifications />
            </div>
          </section>
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