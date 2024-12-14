'use client'
import React from "react"
import axios from "axios"
import { login } from "../util/api"

export default function page(){
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validateData = (username: string, password: string): boolean => {
            let valid;
            valid = true;
            if(username.length < 4){
                (document.getElementById("username") as HTMLParagraphElement).innerText = "Username must be atleast 4 characters long";
                valid = false;
            }else{
                (document.getElementById("username") as HTMLParagraphElement).innerText = "";
            }
            if(password.length < 3){
                (document.getElementById("password") as HTMLParagraphElement).innerText = "Password must be atleast 3 characters long";
                valid = false;
            }else{
                (document.getElementById("password") as HTMLParagraphElement).innerText = "";
            }
            return valid;
        };

        const form = e.currentTarget;
        const data = {
            username: (form[0] as HTMLInputElement).value,
            password: (form[1] as HTMLInputElement).value,
        };
        const res = await login(data.username,data.password);
        const responseData = res?.data;
        if(res?.status === 200){
            window.location.href = "/posts";
        }
        (document.getElementById("username") as HTMLParagraphElement).innerText = "";
        (document.getElementById("password") as HTMLParagraphElement).innerText = "";
        if(res?.status === 400){
            if(responseData?.username){
                (document.getElementById("username") as HTMLParagraphElement).innerText = responseData.username;
            }else{
                (document.getElementById("username") as HTMLParagraphElement).innerText = "";
            }
            if(responseData?.password){
                (document.getElementById("password") as HTMLParagraphElement).innerText = responseData.password;
            }else{
                (document.getElementById("password") as HTMLParagraphElement).innerText = ""; 
            }
        }
        if(res?.status === 401){
            if(responseData?.detail){
                (document.getElementById("password") as HTMLParagraphElement).innerText = responseData.detail;
            }else{
                (document.getElementById("password") as HTMLParagraphElement).innerText = "";
            }
        }
    }

    return(
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-xs">
                    <h1 className="text-center mb-4">Login</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                        <input type="text" placeholder="Username" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                        <p id="username" className="text-red-600"></p>
                        <input type="password" placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                        <p id="password" className="text-red-600"></p>
                        <button className="p-2 bg-blue-500 text-white rounded">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}