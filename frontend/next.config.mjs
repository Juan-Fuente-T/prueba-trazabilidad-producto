/**
 * CONFIGURACIÓN DE COMPATIBILIDAD WEB3
 * El SDK de MetaMask y algunas librerías de WalletConnect intentan cargar módulos
 * pensados para React Native (móvil) como 'fs', 'net' o 'async-storage'.
 * Este bloque le dice a Webpack que ignore esas librerías porque estamos en un
 * entorno Web (Navegador), evitando errores de compilación.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  turbopack: {},

  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
};

export default nextConfig;
