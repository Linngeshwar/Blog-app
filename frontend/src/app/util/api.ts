import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("token"),
    },
});

export const newToken = async (refresh:string) => {
    try{
        const response = await api.post("token/refresh/",{refresh});
        const data = response.data;
        const token = data.access;
        document.cookie = `token=${token}; path=/;`;
        document.cookie = `refresh=${refresh}; path=/;`;
    }catch(err){
        if(axios.isAxiosError(err)){
            return err.response;
        }else{
            console.log(err);
        }
    }
};

export const login = async (username:string,password:string) => {
    try{
        const response = await api.post("token/",{username,password});
        const data = response.data
        const token = data.access;
        const refresh = data.refresh;
        document.cookie = `token=${token}; path=/;`;
        document.cookie = `refresh=${refresh}; path=/;`;
        document.location.href = "/posts";
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
        const response = await api.post("register/",{username,password,email});
        return response;
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
};

export const findUsername = async (id:number) => {
    try{
        return await api.get("users/"+id+"/");
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

export const getUserPosts = async (id:number) => {
    try{
        return await api.get("posts/"+id+"/user_posts/");
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}

export const getTags = async () => {
    try{
        return await api.get("tags/");
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}

export const createPost = async (title:string,content:string,author:number,tags:string) => {
    try{
        return await api.post("posts/",{title,content,author,tags});
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}