import { useSelector } from "react-redux";
import { ReduxStoreType } from "@/types/formTypes";

const useGetStudent = () => {
    const user = useSelector((state: ReduxStoreType) => state.student)
    return user.role
}

export const useGetUserData = () => {
    const userData = useSelector((state: ReduxStoreType) => state.student)
    return userData
}

export const useGetProfilePic = () => {
    const user = useSelector((state: ReduxStoreType) => state.student)
    return user.profilePicture
}

export const useGetStudentToken = () => {
    const token = useSelector((state: ReduxStoreType) => state.student.accessToken)
    return token
}

export default useGetStudent