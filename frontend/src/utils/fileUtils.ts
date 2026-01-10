// TODO: OPTIMIZACIÓN DEL ALMACENAMIENTO
// Actualmente, las imágenes se almacenan como cadenas Base64 directamente en MongoDB para simplificar
// y mantener la autocontención del MVP, aunque aumenta significativamente el tamaño del documento.
// En PRODUCCIÓN se deben transferir las imágenes a un servicio de almacenamiento de dedicado
// (p. ej., AWS S3, Cloudinary) o a un almacenamiento descentralizado (IPFS) almacenando aquí solo la URL.
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};