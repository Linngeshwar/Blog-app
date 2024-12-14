'use client'
import React from "react";
import { register } from "../util/api";
import { motion } from "framer-motion";

export default function page(){

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validateData = (username: string, password: string, confirmpassword: string, email: string): boolean => {
            let valid;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            if(password !== confirmpassword){
                (document.getElementById("confirmpassword") as HTMLParagraphElement).innerText = "Passwords do not match";
                valid = false;
            }else{
                (document.getElementById("confirmpassword") as HTMLParagraphElement).innerText = "";
            }
            if(email.length < 3){
                (document.getElementById("email") as HTMLParagraphElement).innerText = "Email must be atleast 3 characters long";
                valid = false;
            }else{
                (document.getElementById("email") as HTMLParagraphElement).innerText = "";
            }
            if(!emailRegex.test(email)) {
                (document.getElementById("email") as HTMLParagraphElement).innerText = "Invalid email format";
                valid = false;
            }else{
                (document.getElementById("email") as HTMLParagraphElement).innerText = "";
            }
            return valid;        
        };

        const form = e.currentTarget;
        const data = {
        username: (form[0] as HTMLInputElement).value,
        password: (form[2] as HTMLInputElement).value,
        email: (form[1] as HTMLInputElement).value,
        };
        const confirmpassword = (form[3] as HTMLInputElement).value;
        const isValid = validateData(data.username,data.password,confirmpassword,data.email);
        if(!isValid){
            return;
        }
        const res = await register(data.username,data.password,data.email);
        if(res?.status === 201){
            console.log("User Created");
        }else if(res?.status === 400){
            console.log(res?.data);
            if(res?.data.username ){
                (document.getElementById("username") as HTMLParagraphElement).innerText = res?.data.username;
            }else{
                (document.getElementById("username") as HTMLParagraphElement).innerText = "";
            }
            if(res?.data.email){
                (document.getElementById("email") as HTMLParagraphElement).innerText = res?.data.email;
            }else{
                (document.getElementById("email") as HTMLParagraphElement).innerText = "";
            }
            if(res?.data.password){
                (document.getElementById("password") as HTMLParagraphElement).innerText = res?.data.password;
            }else{
                (document.getElementById("password") as HTMLParagraphElement).innerText = "";
            }
        }
    };


    return (
        <div className="flex items-center justify-center    min-h-screen">
            <div className="w-full max-w-xs">
                <motion.h1 
                style={{cursor: "default"}}
                    className="text-center mb-4 font-rubik text-4xl font-medium w-fit place-self-center" 
                    initial={{y:-100, opacity: 0}}
                    animate={{y:0, opacity: 1}}
                    transition={{duration: 0.3}}
                    whileHover={{color: "#cc5fff"}}
                >Register</motion.h1>
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
                        type="email" 
                        placeholder="Email" 
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    />
                    <motion.p 
                        id="email" 
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
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    />
                    <motion.p 
                        id="password" 
                        className="text-red-600 h-5 text-[12px] font-rubik"
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                    ></motion.p>
                    <motion.input 
                        type="password" 
                        placeholder="Confirm Password" 
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        transition={{duration: 0.3}}
                    />
                    <motion.p 
                        id="confirmpassword" 
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
                    >Register</motion.button>
                </form>
            </div>
        </div>
    )
}