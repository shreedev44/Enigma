import { useSelector } from "react-redux";
import { ReduxStoreType } from "@/types/formTypes";

const useGetAdmin = () => {
    const user = useSelector((state: ReduxStoreType) => state.admin)
    return user.role
}

export const useGetAdminData = () => {
    const userData = useSelector((state: ReduxStoreType) => state.admin)
    return userData
}

export const useGetAdminToken = () => {
    const token = useSelector((state: ReduxStoreType) => state.admin.accessToken)
    return token
}

export default useGetAdmin