'use client'
import React from "react"
import { login } from "../util/api"
import { motion } from "framer-motion"

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
        const isValid = validateData(data.username,data.password);
        if(!isValid){
            return;
        }
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
            <div className="w-full max-w-xs">
                <motion.h1 
                                style={{cursor: "default"}}
                                    className="text-center mb-4 font-rubik text-4xl font-medium w-fit place-self-center" 
                                    initial={{y:-100, opacity: 0}}
                                    animate={{y:0, opacity: 1}}
                                    transition={{duration: 0.3}}
                                    whileHover={{color: "#d16dff"}}
                                >Log In</motion.h1>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <motion.input 
                        type="text" 
                        placeholder="Username" 
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    />
                    <motion.p 
                        id="username" 
                        className="text-red-600 h-5 text-[12px] font-rubik"
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                    ></motion.p>
                    <motion.input 
                        type="password" 
                        placeholder="Password" 
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    />
                    <motion.p 
                        id="password" 
                        className="text-red-600 h-5 text-[12px] font-rubik"
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                    ></motion.p>
                    <motion.button 
                        className="p-2 bg-[#d16dff] text-white rounded outline-none font-rubik"
                        whileHover={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                        whileFocus={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                        whileTap={{ scale: 0.98 , backgroundColor: "#c445ff"}}
                        initial={{y:100, opacity: 0}}
                        animate={{y:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    >Log In</motion.button>
                    <motion.div
                        initial={{y:100, opacity: 0}}
                        animate={{y:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    >
                        <p className="text-black font-rubik text-sm mt-4">Don&#39;t have an account? 
                            <motion.a href="/register" className="mx-3 p-1 text-[#cc5fff] rounded-md"
                            whileHover={{ scale: 1.05 , backgroundColor: "#cc5fff", color: "white"}}
                            transition={{duration: 0.5}}
                        >Register
                            </motion.a>
                        </p>
                    </motion.div>
                </form>
            </div>
        </>
    )
}