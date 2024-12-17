import axios, { AxiosError } from "axios";

const getToken = () => {
    if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0].trim() === "token") {
                return cookie[1];
            }
        }
    }
    return "";
};

// Create a function to update the axios instance with the new token
const updateAxiosToken = (newToken: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
};

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
    },
});

// Add a request interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an invalid token and we haven't already tried to refresh
        if (
            error.response?.data?.code === 'token_not_valid' && 
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('refresh='))
                    ?.split('=')[1];

                if (!refresh) {
                    // Redirect to login if no refresh token
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Attempt to get a new access token
                const response = await api.post("token/refresh/", { refresh });
                const newToken = response.data.access;

                // Update cookies
                document.cookie = `token=${newToken}; path=/;`;

                // Update axios default header
                updateAxiosToken(newToken);

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const newToken = async (refresh: string) => {
    try {
        const response = await api.post("token/refresh/", { refresh });
        const data = response.data;
        const token = data.access;
        
        // Update cookies
        document.cookie = `token=${token}; path=/;`;
        
        // Update axios default header
        updateAxiosToken(token);

        return response;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
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

export const updatePost = async (id:number,title:string,content:string,tags:string) => {
    try{
        return await api.put("posts/"+id+"/",{title,content,tags});
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}

export const deletePost = async (id:number) => {
    try{
        return await api.delete("posts/"+id+"/");
    }catch(err){
        if (axios.isAxiosError(err)) {
            return err.response;
        } else {
            console.log(err);
        }
    }
}