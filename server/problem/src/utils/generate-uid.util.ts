export default async function generateUID() {
    const { nanoid } = await import('nanoid')
    const id = nanoid(30)
    return id
}
