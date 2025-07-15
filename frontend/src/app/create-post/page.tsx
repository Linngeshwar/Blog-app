'use client'
import React from "react";
import { useEffect, useState } from "react";
import {motion} from "framer-motion";
import { getTags,createPost } from "../util/api";
import { jwtDecode } from "jwt-decode";

interface Tag {
    name : string;
}

export default function Page(){
    const [tags,setTags] = useState<Tag[]>([]);
    const [userID,setUserID] = useState(0);
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
            if (token) {
                const decodedToken = jwtDecode(token);
                const userID = (decodedToken as { user_id: number }).user_id;
                setUserID(userID);
        }
        const fetchTags = async () => {
            const response = await getTags();
            return response?.data;
        };
        fetchTags().then((data) => {
            setTags(data);
        });
        }
    },[]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validateData = (title: string, content: string, tag: string[]): boolean => {
            let valid;
            valid = true;
            if(title.length < 4){
                (document.getElementById("title") as HTMLParagraphElement).innerText = "Title must be atleast 4 characters long";
                valid = false;
            }else{
                (document.getElementById("title") as HTMLParagraphElement).innerText = "";
            }
            if(content.length < 15){
                (document.getElementById("content") as HTMLParagraphElement).innerText = "Content must be atleast 15 characters long";
                valid = false;
            }else{
                (document.getElementById("content") as HTMLParagraphElement).innerText = "";
            }
            if(tag.length === 0){
                (document.getElementById("tags") as HTMLParagraphElement).innerText = "Please select a tag";
                valid = false;
            }else{
                (document.getElementById("tags") as HTMLParagraphElement).innerText = "";
            }
            return valid;
        }

        const form = e.currentTarget;
        const title = (form[0] as HTMLInputElement).value;
        const content = (form[1] as HTMLTextAreaElement).value;
        const tagOptions = (form[2] as HTMLSelectElement).selectedOptions;
        const tags = Array.from(tagOptions).map(option => option.value);
        const stringTags = tags.join(" ");
        const isValid = validateData(title,content,tags);
        if(!isValid){
            return;
        }
        try{
            const res = await createPost(title,content,userID,stringTags);
            if(res?.status === 201){
                window.location.href = "/my-posts";
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <motion.div className="w-full max-w-xl">
            <motion.form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                <motion.input 
                    type="text" 
                    placeholder="Title" 
                    className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                    autoComplete="off"
                    whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                    initial={{x:-100, opacity: 0}}
                    animate={{x:0, opacity: 1}}
                    transition={{duration: 0.3}}
                />
                <motion.p 
                    id="title" 
                    className="text-red-600 h-5 text-[12px] font-rubik"
                    initial={{x:-100, opacity: 0}}
                    animate={{x:0, opacity: 1}}
                ></motion.p>
                <motion.textarea 
                    placeholder="Content" 
                    className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                    autoComplete="off"
                    whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                    initial={{x:100, opacity: 0}}
                    animate={{x:0, opacity: 1}}
                    transition={{duration: 0.3}}
                />
                <motion.p 
                    id="content" 
                    className="text-red-600 h-5 text-[12px] font-rubik"
                    initial={{x:100, opacity: 0}}
                    animate={{x:0, opacity: 1}}
                ></motion.p>
                <motion.select
                    className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                    transition={{ duration: 0.3 }}
                    multiple
                >
                    {tags.map((tag, index) => (
                        <motion.option 
                            key={index} 
                            value={tag.name}
                        >
                            {tag.name}
                        </motion.option>
                    ))}
                </motion.select>
                <motion.p
                    id="tags"
                    className="text-red-600 h-5 text-[12px] font-rubik"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                ></motion.p>
                <motion.button 
                    className="p-2 bg-[#d16dff] text-white rounded outline-none font-rubik"
                    whileHover={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                    whileFocus={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                    whileTap={{ scale: 0.98 , backgroundColor: "#c445ff"}}
                    initial={{y:100, opacity: 0}}
                    animate={{y:0, opacity: 1}}
                    transition={{duration: 0.3}}
                >Create Post</motion.button>
            </motion.form>
        </motion.div>
    )
}