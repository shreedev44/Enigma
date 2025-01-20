import {createSlice} from '@reduxjs/toolkit'
import { UserStoreType } from '@/types/formTypes'

const initialState: UserStoreType = {
    _id: '',
    email: '',
    role: '',
    status: '',
    name: '',
    accessToken: null,
}


const AdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            return {...state, ...action.payload}
        },
        removeAdmin: () => {
            return initialState
        }
    }
})


export const {setAdmin, removeAdmin} = AdminSlice.actions;
export default AdminSlice.reducer;