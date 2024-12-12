import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("token"),
    },
});

export const login = async (username:string,password:string) => {
    try{
        const response = await api.post("token/",{username,password});
        const data = response.data
        const token = data.access;
        const refresh = data.refresh;
        localStorage.setItem("token",token);
        localStorage.setItem("refresh",refresh);
    }catch(err){
        if(axios.isAxiosError(err)){
            return err.response;
        }else{
            console.log(err);
        }
    }
}

export const register = async (username:string,password:string,email:string) => {
    try{
        await api.post("register/",{username,password,email});
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
};

export const listUsers = async () => {
    try{
        return await api.get("users/");
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
};

export const getPosts = async () => {
    try{
        return await api.get("posts/");
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}