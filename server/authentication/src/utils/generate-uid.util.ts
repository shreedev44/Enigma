export async function generateUID () {
    const { nanoid } = await import('nanoid')
    const id = nanoid(40);
    return id
}