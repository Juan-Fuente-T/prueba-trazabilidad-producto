import Image from "next/image";
export default function Footer() {


    return (
        <footer className="flex justify-center items-center w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-sm sm:text-lg font-bold border-t border-stone-500 gap-6 bg-zinc-100">
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
    )
}