'use client'
import React from "react";
import {useState,useEffect} from "react";
import { usePathname } from "next/navigation";
import { findUsername } from "../util/api";
import { motion,AnimatePresence } from "framer-motion";
import LogInButton from "./LogInButton";
import RegisterButton from "./RegisterButton";
import { jwtDecode } from "jwt-decode";

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
                const decodedToken = jwtDecode(token);
                const userID = (decodedToken as { user_id: number }).user_id;
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

    const navItems = [
        {name: "Profile",link: "/profile"},
        {name: "Create Post",link: "/create-post"},
        {name: "My Posts",link: "/my-posts"},
        {name: "Log Out",link: logout}
    ]

    return(<>
            {!isAuthenticated ? (
                <div className="flex flex-row justify-between p-4 mb-2">
                    <motion.p className="text-5xl font-semibold font-rubik mt-2 ml-4"
                        style={{cursor: "pointer"}}
                        whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                        transition={{ duration: 0.5 }} 
                        onClick={() => {document.location.href = "/"}}
                        >Blog Site
                    </motion.p>                    
                    {pathName === "/login" && <RegisterButton />}
                    {pathName === "/register" && <LogInButton />}
                    {pathName === "/" && 
                        <div className="flex flex-row gap-3">
                            <LogInButton /><RegisterButton />
                        </div>
                    }
                </div>
            ) : (
                <div className="flex flex-row p-4 justify-between mb-2">
                    <AnimatePresence>
                        <motion.p className="text-5xl font-semibold font-rubik mt-2 ml-4"
                            style={{cursor: "pointer"}}
                            whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                            transition={{ duration: 0.5 }} 
                            onClick={() => {document.location.href = "/posts"}}
                            >Blog Site
                        </motion.p>  
                    </AnimatePresence>
                    <motion.nav className="flex flex-row w-[50rem] bg-[#f0d0ff] rounded-lg py-2 px-20 relative top-0 -left-5"
                        transition={{ duration: 0.5 }}
                        initial={{opacity: 0,y: -100}}
                        animate={{opacity: 1,y: 0}}
                        exit={{opacity: 0,y:-100}}
                    >
                        <motion.ul className="flex flex-wrap gap-4">
                            {navItems.map((item) => (
                                <motion.li className="text-black font-rubik text-lg place-self-center justify-center whitespace-nowrap mx-4 px-5 py-[2px] rounded-md "
                                    style={{cursor: "pointer",color: "black",transformOrigin:"center"} }
                                    onClick={() => {
                                        if (typeof item.link === 'string') {
                                            document.location.href = item.link;
                                        } else {
                                            item.link();
                                        }
                                    }}
                                    whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white"}}
                                    transition={{ duration: 0.2 }}
                                    initial={{x: 100,opacity: 0}}
                                    animate={{x: 0,opacity: 1}}
                                    exit={{x: 100,opacity: 0}}
                                >
                                    {item.name}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.nav>
                    <AnimatePresence>
                        <motion.p className="text-2xl font-semibold font-rubik place-self-center pr-4"
                            style={{cursor: "pointer"}}
                            whileHover={{ scale: 1.1 ,color: "#cc5fff"}}
                            onClick={() => {document.location.href = "/profile"}}
                            transition={{ duration: 0.3 }}
                        >
                            {username.charAt(0).toUpperCase() + username.slice(1)} 
                        </motion.p>
                    </AnimatePresence>
                </div>
            )
            }
        </>
    )
}