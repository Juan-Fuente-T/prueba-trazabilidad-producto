export const getProductFromDB = async (productId: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${productId}`, {
            cache: 'no-store'
        })
        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error("Error servidor")
        }
        const json = await response.json()
        return json.data || json
    } catch (error) {
        console.error("❌ Error de red al buscar producto:", error);
        return null;
    }
}