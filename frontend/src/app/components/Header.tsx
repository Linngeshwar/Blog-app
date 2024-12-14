'use client'
import React from "react";
import {useState,useEffect} from "react";
import { findUsername } from "../util/api";
import {motion } from "framer-motion";

export default function Header(){
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [username,setUsername] = useState("");
    useEffect(() => {
        const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
        if(token === undefined){
            setIsAuthenticated(false);
        }else{
            setIsAuthenticated(true);
        }
        const getUsername = async () => {
            const response = await findUsername(1);
            setUsername(response?.data.username);
        }
        getUsername();
    },[]);

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.location.href = "/login";
    }

    return(<>
            {!isAuthenticated ? (
                <div className="flex flex-row justify-between">
                    
                </div>
            ) : (
                <div className="flex flex-row p-4 justify-between">
                    <p className="text-5xl font-semibold font-rubik">Blog Site</p>
                    <div className="flex flex-row">
                        <p className="text-2xl font-semibold font-rubik place-self-center pr-3">{username.charAt(0).toUpperCase() + username.slice(1)} </p>
                        <motion.button className="bg-[#cc5fff] text-white rounded-full px-4 place-self-center py-2 font-rubik" 
                            onClick={logout}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >Log Out</motion.button>
                    </div>
                </div>
            )
            }
        </>
    )
}