import {createSlice} from '@reduxjs/toolkit'
import { UserStoreType } from '@/types/formTypes'

const initialState: UserStoreType = {
    _id: '',
    email: '',
    role: '',
    status: '',
    profilePicture: '',
    accessToken: null,
}


const recruiterSlice = createSlice({
    name: 'recruiter',
    initialState,
    reducers: {
        setRecruiter: (state, action) => {
            return {...state, ...action.payload}
        },
        removeRecruiter: () => {
            return initialState
        }
    }
})


export const {setRecruiter, removeRecruiter} = recruiterSlice.actions;
export default recruiterSlice.reducer;