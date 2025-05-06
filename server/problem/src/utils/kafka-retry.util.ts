const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export const retryProcessing = async (
    message: { value: Buffer },
    handler: (message: { value: Buffer }) => Promise<void>,
    attempt = 1
): Promise<void> => {
    try {
        await handler(message)
    } catch (_error) {
        if (attempt < MAX_RETRIES) {
            console.warn(`Retrying message processing (Attempt ${attempt + 1}/${MAX_RETRIES})...`)
            setTimeout(() => retryProcessing(message, handler, attempt + 1), RETRY_DELAY_MS)
        } else {
            console.error('Max retries reached. Failed to process message:', message)
        }
    }
}
