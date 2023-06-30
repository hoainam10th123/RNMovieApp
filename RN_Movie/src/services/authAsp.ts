import axios from 'axios';
import { BASE_URL_MYSERVER } from '../common/constanst';
import { IUser } from '../models/user';

export const login = async (model: any)=>{
    const res = await axios.post<IUser>(`${BASE_URL_MYSERVER}/account/login`, model,{headers:{
        'Content-Type':'application/json'
    }});
    return res.data;
}