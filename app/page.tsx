'use client'

import Image from "next/image";
import RegisterProductModal from "@/components/RegisterProductModal";
import DeleteProductModal from "@/components/DeleteProductModal";
import TransferProductModal from "@/components/TransferProductModal";
import Header from "@/components/Header";
import { useAccount } from "wagmi";


export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  pb-20 gap-16 sm:p-20">
      <Header />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Cetim&apos;s Product Traceability</h1>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Product Traceabilidad de producto</h1>
            </div>
            {isConnected ? (
              <div className="grid gap-6">
                <p className="text-green-500 mb-4">Wallet conectada</p>
                {/* Botones principales */}
                <div className="flex gap-4">
                  <RegisterProductModal />
                  <DeleteProductModal />
                </div>

                {/* Búsqueda y transferencia */}
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Transfer Product</h2>
                  {/* <ProductSearch /> */}
                  <TransferProductModal />
                </div>
              </div>
            ) : (
              <p className="text-red-500 mb-4">Por favor, conecta tu wallet para interactuar con el contrato.</p>
            )}
          </main>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
