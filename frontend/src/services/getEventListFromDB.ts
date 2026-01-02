export const getEventListFromDB = async (productId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${productId}/history`)
    if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Error servidor")
    }
    const json = await response.json()
    return json.data
}