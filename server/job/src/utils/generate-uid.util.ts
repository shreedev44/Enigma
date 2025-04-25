export async function generateUID(length = 10) {
    const { nanoid } = await import('nanoid')
    const id = nanoid(length)
    return id
}
