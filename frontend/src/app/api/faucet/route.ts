import { NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const PRIVATE_KEY = process.env.MASTER_WALLET_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

if (!PRIVATE_KEY || !RPC_URL) {
    throw new Error("Faltan variables de entorno (MASTER_WALLET_PRIVATE_KEY o RPC_URL)");
}

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

// Balance de la cuenta
const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL)
});

// Enviar Transacción
const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL)
});

interface FaucetRequest {
    userAddress: `0x${string}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as FaucetRequest;
        const { userAddress } = body;

        if (!userAddress || !userAddress.startsWith('0x')) {
            return NextResponse.json({ error: "Address inválida o faltante" }, { status: 400 });
        }

        // Comprueba si la Master Wallet tiene fondos para enviar
        const masterBalance = await publicClient.getBalance({ address: account.address });
        if (masterBalance < parseEther("0.02")) {
            console.error("❌ [FAUCET] ERROR CRÍTICO: La wallet maestra no tiene saldo.");
            return NextResponse.json({ error: "Faucet sin fondos" }, { status: 500 });
        }

        // Envia fondos
        const hash = await walletClient.sendTransaction({
            to: userAddress,
            value: parseEther("0.02"),
            maxPriorityFeePerGas: parseEther("0.000000002"), // 2 gwei de propina para que pase rápido
            // Hace que no espere de más si no es necesario
            kzg: undefined,
        });

        return NextResponse.json({
            success: true,
            txHash: hash,
            message: "Proceso completado"
        });

    } catch (error: unknown) {
        let errorMessage = "Error desconocido en el proceso";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error Faucet:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}