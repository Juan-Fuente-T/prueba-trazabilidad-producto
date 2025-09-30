'use client'

import Image from "next/image";
import RegisterProductModal from "@/components/RegisterProductModal";
import DeleteProductModal from "@/components/DeleteProductModal";
import TransferProductModal from "@/components/TransferProductModal";
import Header from "@/components/Header";
import { useAccount } from "wagmi";
import ProductSearch from "@/components/ProductSearch";
import EventNotifications from "@/components/EventNotifications";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  pb-20 gap-16 sm:p-20">
      <Header />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Prueba técnica para traceabilidad de producto con Next y Solidity</h1>
            </div>
            {isConnected ? (
              <div className="grid gap-6 justify-center">
                <div className="flex  gap-20 justify-items-stretch">
                  {/* Botones de registro,borrado y transferencia */}
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Registrar Product</h2>
                    <RegisterProductModal />
                  </div>
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Borrar Product</h2>
                    <DeleteProductModal />
                  </div>
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Transfer Product</h2>
                    <TransferProductModal />
                  </div>
                </div>
                {/* Búsqueda de productos y notificación de eventos*/}
                <ProductSearch />
                <EventNotifications/>
              </div>
            ) : (
              <p className="flex justify-center text-red-500 font-bold text-xl border border-red-700 rounded-md p-4">Por favor, conecta tu wallet para interactuar con el contrato.</p>
            )}
          </main>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl"
          href="https://github.com/Juan-Fuente-T/prueba-trazabilidad-producto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Repositorio →
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl"
          href="https://sepolia.etherscan.io/address/0xE509E7039bd8D78518822B5cBE80E93D84D2c452"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Etherscan →
        </a>
      </footer>
    </div>
  );
}
