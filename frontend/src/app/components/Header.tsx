'use client'
import React from "react";
import {useState,useEffect} from "react";
import { usePathname } from "next/navigation";
import { findUsername } from "../util/api";
import { motion,AnimatePresence } from "framer-motion";
import LogInButton from "./LogInButton";
import RegisterButton from "./RegisterButton";

export default function Header(){
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [username,setUsername] = useState("");
    // const [path,setPath] = useState("");   
    const [showOptions,setShowOptions] = useState(false);

    const pathName = usePathname();  
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
            if (token) {
                const jwt = token.split("=")[1];
                const base64Url = jwt.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodedToken = JSON.parse(jsonPayload);
                const userID = decodedToken.user_id;
                const getUsername = async () => {
                    const response = await findUsername(userID);
                    setUsername(response?.data.username);
                }
                getUsername();
            }
            if(token === undefined){
                setIsAuthenticated(false);
            }else{
                setIsAuthenticated(true);
            }
            // setPath(document.location.pathname);
        }
    },[]);

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.location.href = "/login";
    }

    return(<>
            {!isAuthenticated ? (
                <div className="flex flex-row justify-between p-4">
                    <motion.p className="text-5xl font-semibold font-rubik mt-2 ml-2"
                        style={{cursor: "pointer"}}
                        whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                        transition={{ duration: 0.5 }} 
                        onClick={() => {document.location.href = "/posts"}}
                        >Blog Site
                    </motion.p>                    {pathName === "/login" && <RegisterButton />}
                    {pathName === "/register" && <LogInButton />}
                    {pathName === "/" && 
                        <div className="flex flex-row">
                            <LogInButton /><RegisterButton />
                        </div>
                    }
                </div>
            ) : (
                <div className="flex flex-row p-4 justify-between">
                    <motion.p className="text-5xl font-semibold font-rubik mt-2 ml-2"
                        style={{cursor: "pointer"}}
                        whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                        transition={{ duration: 0.5 }} 
                        onClick={() => {document.location.href = "/posts"}}
                        >Blog Site
                    </motion.p>  
                    <div className="flex flex-row"
                        onMouseOver={() => {if(showOptions){setShowOptions(true)}}}
                        onMouseOut={() => setShowOptions(false)}
                        onMouseEnter={() => {if(showOptions){setShowOptions(true)}}}
                        onMouseLeave={() => setShowOptions(false)}
                    >
                        <AnimatePresence>
                        {showOptions &&(
                            <motion.div className="flex flex-row bg-[#f0d0ff] rounded-lg py-2 px-10 relative top-0 -left-5"
                                onMouseOver={() => setShowOptions(true)}
                                onMouseOut={() => setShowOptions(false)}
                                onMouseEnter={() => setShowOptions(true)}
                                onMouseLeave={() => setShowOptions(false)}
                                transition={{ duration: 0.5 }}
                                initial={{opacity: 0,x:100}}
                                animate={{opacity: 1,x:0}}
                                exit={{opacity: 0,x:100}}
                            >
                                <motion.p className="text-black font-rubik place-self-center text-lg mx-4 px-5 py-1 rounded-md"
                                    style={{cursor: "pointer"}}
                                    onClick={() => {document.location.href = "/profile"}}
                                    whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white"}}
                                    transition={{ duration: 0.2 }}
                                    initial={{x: 100,opacity: 0}}
                                    animate={{x: 0,opacity: 1}}
                                    exit={{x: 100,opacity: 0}}
                                >
                                    Profile
                                </motion.p>
                                <motion.p className="text-black font-rubik text-lg place-self-center mx-4 px-5 py-1 rounded-md"
                                    style={{cursor: "pointer"}}
                                    onClick={() => {document.location.href = "/create-post"}}
                                    whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white"}}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    initial={{x: 100,opacity: 0}}
                                    animate={{x: 0,opacity: 1}}
                                    exit={{x: 100,opacity: 0}}
                                >
                                    Create Post
                                </motion.p>
                                <motion.p className="text-black font-rubik text-lg place-self-center mx-4 px-5 py-1 rounded-md"
                                    style={{cursor: "pointer"}}
                                    onClick={() => {document.location.href = "/my-posts"}}
                                    whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white"}}
                                    transition={{ duration: 0.2, delay: 0.2 }}
                                    initial={{x: 100,opacity: 0}}
                                    animate={{x: 0,opacity: 1}}
                                    exit={{x: 100,opacity: 0}}
                                >
                                    My Posts
                                </motion.p>
                                <motion.p className="text-black font-rubik text-lg place-self-center mx-4 px-5 py-1 rounded-md"
                                    style={{cursor: "pointer"}}
                                    onClick={logout}
                                    whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white" }}
                                    transition={{ duration: 0.2, delay: 0.3 }}
                                    initial={{x: 100,opacity: 0}}
                                    animate={{x: 0,opacity: 1}}    
                                    exit={{x: 100,opacity: 0}}
                                >
                                    Log Out
                                </motion.p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <motion.p className="text-2xl font-semibold font-rubik place-self-center pr-4"
                            style={{cursor: "pointer"}}
                            whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                            onClick={() => {document.location.href = "/profile"}}
                            transition={{ duration: 0.3 }}
                            onMouseOver={() => setShowOptions(true)}
                            onMouseOut={() => setShowOptions(false)}
                            onMouseEnter={() => setShowOptions(true)}
                            onMouseLeave={() => setShowOptions(false)}
                        >
                            {username.charAt(0).toUpperCase() + username.slice(1)} 
                        </motion.p>
                    </div>
                </div>
            )
            }
        </>
    )
}