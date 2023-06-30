import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IUser } from '../../models/user'
import { RootState } from '../store'

interface UserState {
    user: IUser | null,
    loading: boolean,
    isLoggedIn: boolean,
    message: string
}

const initialState: UserState = {
    user: null,
    loading: false,
    isLoggedIn: false,
    message: ''
}

export const userSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        LoginRequest: (state) => {
            state.loading = true
        },
        LoginSuccess: (state, action: PayloadAction<IUser>) => {
            state.loading = false
            state.isLoggedIn = true
            state.message = '200'
            state.user = action.payload
        },
        LoginFailed: (state, action) => {
            state.loading = false
            state.isLoggedIn = false
            state.message = action.payload.message
        },
        Signout: (state) => {
            state.loading = false
            state.isLoggedIn = false
            state.message = ''
            state.user = null
        },
    },
    
})

export const { LoginRequest, LoginSuccess, LoginFailed, Signout } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user

export default userSlice.reducer