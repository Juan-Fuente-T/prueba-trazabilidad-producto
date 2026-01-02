export const getProductListFromDB = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`)
    if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Error servidor")
    }
    const json = await response.json()
    return json.data
}