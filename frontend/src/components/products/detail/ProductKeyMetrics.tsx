import { ProductUI } from '@/types/product';
import { shortenAddress } from '@/utils/formatters';

interface ProductKeyMetricsProps {
    productDB: ProductUI;
}

export const ProductKeyMetrics = ({ productDB }: ProductKeyMetricsProps) => {

    const handleCopy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => alert("Hash copiado!"));
        }
    }

    return (
        // KPIs: Cantidad, Custodio y Hash de autenticación
        <div className="grid grid-cols-3 w-full gap-4 h-full">
            {/* 1. Volumen */}
            <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-acero-400 uppercase">Volumen</p>
                <p className="text-base font-mono font-bold text-acero-800">
                    {Number(productDB?.quantity).toLocaleString()} <span className="text-xs font-sans font-normal text-acero-500">uds.</span>
                </p>
            </div>

            {/* 2. Custodio */}
            <div className="flex flex-col justify-center min-w-0">
                <p className="text-[10px] font-bold text-acero-400 uppercase">Custodio</p>
                <p className="text-xs font-mono font-bold text-acero-700 truncate" title={productDB?.currentOwner}>
                    {shortenAddress(productDB?.currentOwner)}
                </p>
            </div>

            {/* 3. Huella Digital */}
            <div className="flex flex-col justify-center min-w-0">
                <p className="text-[10px] font-bold text-acero-400 uppercase flex items-center gap-1">
                    Huella Digital
                    <button onClick={() => handleCopy(productDB?.characterizationHash || '')} title="Copiar" className="hover:text-industrial">📋</button>
                </p>
                <code className="text-xs font-mono text-acero-600 bg-white px-1 py-0.5 rounded border border-acero-200 truncate block" title={productDB?.characterizationHash}>
                    {shortenAddress(productDB?.characterizationHash)}
                </code>
            </div>
        </div>
    )
};