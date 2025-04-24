import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '@configs'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
export const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-pro-exp-02-05',
})
