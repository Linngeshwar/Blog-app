import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTags } from "../util/api";
import { updatePost } from "../util/api";

interface Post {
    id: number,
    title: string,
    content: string,
    tags:{
        id: number;
        name: string;
    }[];
    handleEditPost: (value: boolean) => void;
}

export default function EditPost(Post: Post){

    const [tags, setTags] = useState<Post["tags"]>([]);
    // const [userID,setUserID] = useState(0);

    useEffect(() => {
        const fetchTags = async () => {
        const response = await getTags();
        return response?.data;
    };
    fetchTags().then((data) => {
        setTags(data);
    }); 
        addEventListener("keydown", (e) => {
            if(e.key === "Escape"){
                Post.handleEditPost(false);
            }
        });

        return () => {
            removeEventListener("keydown", (e) => {
                if(e.key === "Escape"){
                    Post.handleEditPost(false);
                }
            });
        }
    }, []);


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
            const res = await updatePost(Post.id,title,content,stringTags);
            if(res?.status === 200){
                window.location.href = "/my-posts";
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {Post.handleEditPost(false)}}
        >
            <motion.div className="w-full max-w-xl">
                <motion.div className="font-rubik text-2xl place-self-end bg-[#ecc4ff] z-20 w-fit px-2 mb-1 rounded-sm outline-none"
                         style={{cursor: "pointer"}}
                    onClick={() => {Post.handleEditPost(false)}}
                    initial={{x:100, opacity: 0}}
                    animate={{x:0, opacity: 1}}
                    exit={{x:100, opacity: 0}}
                    transition={{duration: 0.3}}
                    whileHover={{ scale: 1.05 , backgroundColor: "#d16dff"}}
                    whileTap={{ scale: 0.98 , backgroundColor: "#d16dff"}}
                >X</motion.div>
                <motion.form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                    <motion.label
                        className="text-black font-rubik bg-[#ecc4ff] z-20 w-fit px-2 mb-1 rounded-sm"
                        initial={{scale: 1.3,opacity: 0}}
                        animate={{scale: 1,opacity: 1}}
                        exit={{scale: 0.7,opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    >Title:</motion.label>
                    <motion.input 
                        type="text" 
                        defaultValue={Post.title}
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        exit={{x:-100, opacity: 0}}
                        transition={{duration: 0.3}}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <motion.p 
                        id="title" 
                        className="text-red-600 h-5 text-[12px] font-rubik"
                        initial={{x:-100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        exit={{x:-100, opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    ></motion.p>
                    <motion.label
                        className="text-black font-rubik bg-[#ecc4ff] z-20 w-fit px-2 mb-1 rounded-sm"
                        initial={{scale: 1.3,opacity: 0}}
                        animate={{scale: 1,opacity: 1}}
                        exit={{scale: 0.7,opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    >Content:</motion.label>
                    <motion.textarea 
                        // placeholder="Content" 
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black placeholder:text-[#6e6c6c]" 
                        autoComplete="off"
                        defaultValue={Post.content}
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        initial={{x:100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        exit={{x:100, opacity: 0}}
                        transition={{duration: 0.3}}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <motion.p 
                        id="content" 
                        className="text-red-600 h-5 text-[12px] font-rubik"
                        initial={{x:100, opacity: 0}}
                        animate={{x:0, opacity: 1}}
                        exit={{x:100, opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    ></motion.p>
                    <motion.label
                        className="text-black font-rubik bg-[#ecc4ff] z-20 w-fit px-2 mb-1 rounded-sm"
                        initial={{scale: 1.3,opacity: 0}}
                        animate={{scale: 1,opacity: 1}}
                        exit={{scale: 0.7,opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    >Tags:</motion.label>
                    <motion.select
                        className="p-2 border-[#d16dff] border-2 outline-none font-rubik bg-[#ecc4ff] rounded text-black"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileFocus={{ scale: 1.05 , backgroundColor: "#efceff"}}
                        transition={{ duration: 0.3 }}
                        exit={{x: -100, opacity: 0}}
                        multiple
                        onClick={(e) => e.stopPropagation()}
                    >
                        {tags.map((tag, index) => (
                            <motion.option 
                                key={index} 
                                value={tag.name}
                                selected={Post.tags.some(postTag => postTag.name === tag.name)}
                                onClick={(e) => e.stopPropagation()}
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
                        exit={{x: -100, opacity: 0}}
                        onClick={(e) => e.stopPropagation()}
                    ></motion.p>
                    <motion.button 
                        className="p-2 bg-[#d16dff] text-white rounded outline-none font-rubik"
                        whileHover={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                        whileFocus={{ scale: 1.05 , backgroundColor: "#cc5fff"}}
                        whileTap={{ scale: 0.98 , backgroundColor: "#c445ff"}}
                        initial={{y:100, opacity: 0}}
                        animate={{y:0, opacity: 1}}
                        exit={{y:100, opacity: 0}}
                        transition={{duration: 0.3}}
                        onClick={(e) => e.stopPropagation()}
                    >Update Details</motion.button>
                </motion.form>
            </motion.div>
        </motion.div>
    )
}   