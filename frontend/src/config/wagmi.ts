import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, type CreateConnectorFn } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
// const ALCHEMY_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const ALCHEMY_URL = "https://ethereum-sepolia-rpc.publicnode.com";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x" + sepolia.id.toString(16),
  rpcTarget: ALCHEMY_URL,
  displayName: "Sepolia Testnet",
  blockExplorer: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

//ADAPTADOR (PrivateKeyProvider)
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

// Instancia de Web3Auth
const web3AuthInstance = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  chainConfig,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "Product Traceability",
    mode: "light",
    loginMethodsOrder: ["google", "email_passwordless"],
    defaultLanguage: "es",
    modalZIndex: "2147483647",
  },
});

//EL CONECTOR RECIBE LA INSTANCIA
const web3AuthConnectorInstance = Web3AuthConnector({
  web3AuthInstance
});

// CONFIGURACIÓN DE RAINBOWKIT + WEB3AUTH
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recomendado',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
    // Si se quiere que Google salga DENTRO del modal de RainbowKit, habría que crear un adaptador.
    // Pero para usarlo en el botón personalizado, basta con que Wagmi lo conozca.
  ],
  {
    appName: 'Product Traceability',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  }
);

// CONFIGURACIÓN FINAL (Fusiona todo)
export const config = createConfig({
  chains: [sepolia],
  transports: {
    // [sepolia.id]: http(),
    [sepolia.id]: http(ALCHEMY_URL, {
        batch: { wait: 16 }, // Optimización para agrupar llamadas
    }),
  },
  // Une los conectores de RainbowKit + el de Web3Auth
  connectors: [
    ...connectors,
    web3AuthConnectorInstance as CreateConnectorFn
  ],
  cacheTime: 0,
  pollingInterval: 30_000, // IMPORTANTE: Por defecto es 4000 (4s). 30000 es 30 segundos.
  ssr: true,
});

//Configuracion sin web3auth account abstraction
// export const config = getDefaultConfig({
//     appName: 'Product Traceability',
//     projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
//     chains: [sepolia],
//     ssr: true,
//     })
//     declare module 'wagmi' {
//         interface Register {
//             config: typeof config
//         }
//     }