import { Dispatch } from "@reduxjs/toolkit"
import { login } from "../../services/authAsp"
import { LoginFailed, LoginRequest, LoginSuccess } from "../reducers/userReducer"

export const loginAction = (creds:any) => async (dispatch:Dispatch) =>{
    try{
        dispatch(LoginRequest())

        const data = await login(creds)

        dispatch(LoginSuccess(data))
    }catch(e:any){
        dispatch(LoginFailed(e.response.data))
    }
}