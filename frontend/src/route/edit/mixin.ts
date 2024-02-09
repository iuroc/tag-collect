export const fetchTags = async () => {
    const res = await fetch('/api/tags')
    const data = await res.json()
    if (data.success) return data.data as { text: string, count: number }[]
    else {
        alert(data.message)
        throw new Error(data.message)
    }
}