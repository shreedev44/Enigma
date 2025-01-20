import { useSelector } from "react-redux";
import { ReduxStoreType } from "@/types/formTypes";

const useGetRecruiter = () => {
    const user = useSelector((state: ReduxStoreType) => state.recruiter)
    return user.role
}

export const useGetRecruiterData = () => {
    const userData = useSelector((state: ReduxStoreType) => state.recruiter)
    return userData
}

export const useGetProfilePic = () => {
    const user = useSelector((state: ReduxStoreType) => state.recruiter)
    return user.profilePicture
}

export const useGetRecruiterToken = () => {
    const token = useSelector((state: ReduxStoreType) => state.recruiter.accessToken)
    return token
}

export default useGetRecruiter