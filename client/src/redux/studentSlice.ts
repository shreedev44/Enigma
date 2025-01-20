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


const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setStudent: (state, action) => {
            return {...state, ...action.payload}
        },
        removeStudent: () => {
            return initialState
        }
    }
})


export const {setStudent, removeStudent} = studentSlice.actions;
export default studentSlice.reducer;