import { Dispatch } from "@reduxjs/toolkit"
import { resquest, setErrorMessage } from "../reducers/presenceHubReducer"
import { suggestMoviesAi } from "../../services/movieApi"
import Toast from 'react-native-toast-message';

export const suggestMoviesAction = () => async (dispatch:Dispatch) =>{
    try{
        dispatch(resquest())
        await suggestMoviesAi()
    }catch(e:any){
        //e.response.status
        //dispatch(setErrorMessage(e.message))
        Toast.show({
            type: 'error',
            text1: e.message,
        });
    }
}