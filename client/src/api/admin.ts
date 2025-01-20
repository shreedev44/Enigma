/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { adminEndpoints } from "@/constants/endpointUrl";


export const signin = async (email: string, password: string) => {
    try {
        const { data } = await Api.post(adminEndpoints.SIGNIN, {email, password})
        return {success: true, data}
    } catch (err) {
        const error = err as any;
        const message = error.response?.data?.error || "An error occured"
        return {success: false, error: message}
    }
}