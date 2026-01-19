import Image from "next/image";
export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-acero-900 border-t border-acero-800 text-acero-400 text-sm mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* 1. Identidad Corporativa */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2 opacity-80 grayscale hover:grayscale-0 transition-all">
                            <Image
                                src="/cetim-centro-tecnologico-logo-web-2023.png"
                                alt="CETIM"
                                width={100}
                                height={30}
                                className="h-5 w-auto brightness-0 invert"
                            />
                        </div>
                        <p className="text-xs text-acero-500">
                            © {currentYear} Plataforma de Trazabilidad Segura.
                        </p>
                    </div>

                    {/* 2. Enlaces de Auditoría y Soporte */}
                    <div className="flex gap-6 text-xs font-mono">
                        <a
                            href="https://sepolia.etherscan.io/address/0xE509E7039bd8D78518822B5cBE80E93D84D2c452"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-acero-200 hover:text-industrial transition-colors group"
                        >
                            <span className="bg-acero-800 p-1.5 rounded-full group-hover:bg-industrial/10">
                                🔗
                            </span>
                            Auditoría Pública (Etherscan)
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-2 text-acero-200 hover:text-white transition-colors cursor-not-allowed opacity-60"
                        >
                            <span className="bg-acero-800 p-1.5 rounded-full">
                                🛡️
                            </span>
                            Soporte Técnico
                        </a>
                    </div>
                </div>

                {/* 3. Barra inferior legal */}
                <div className="mt-8 pt-4 border-t border-acero-800/50 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-[10px] text-acero-600 gap-2">
                    <p>Sistema desplegado en red de pruebas (Sepolia Testnet).</p>
                    <div className="flex gap-4">
                        <span>Privacidad</span>
                        <span>Términos de Uso</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}