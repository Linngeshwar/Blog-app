'use client'
import React from "react";
import { register,listUsers } from "../util/api";
import { useEffect,useState } from "react";
import { s } from "framer-motion/client";

export default function page(){

    const [users,setUsers] = useState([]);
    
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

    useEffect(() => {
        const getUsers = async () => {
            const res = await listUsers();
            return res?.data;
        }
        getUsers().then((data) => {
            setUsers(data);
        });
    },[]);


    return (
        <div className="flex items-center justify-center    min-h-screen">
            <div className="w-full max-w-xs">
                <h1 className="text-center mb-4">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <input type="text" placeholder="Username" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                    <p id="username" className="text-red-600"></p>
                    <input type="email" placeholder="Email" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                    <p id="email" className="text-red-600"></p> 
                    <input type="password" placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                    <p id="password" className="text-red-600"></p>
                    <input type="password" placeholder="Confirm Password" className="mb-2 p-2 border border-gray-300 rounded text-black" />
                    <p id="confirmpassword" className="text-red-600"></p>
                    <button className="p-2 bg-blue-500 text-white rounded">Register</button>
                </form>
                <ul className="mt-4">
                    {users.map((user: any) => (
                        <li key={user.id}>{user.username} - {user.email}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}