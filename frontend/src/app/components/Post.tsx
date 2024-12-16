import React from "react";
import { AnimatePresence,motion } from "framer-motion";
import Votes from "./Votes";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";

interface Post {
    key: number,
    title: string,
    content: string,
    author: string,
    tags:{
        id: number;
        name: string;
    }[];
    upvotes: number,
    downvotes: number,
}

export default function Post(Post: Post){
    const pathName = usePathname();
    const [showEdit,setShowEdit] = useState(false);
    useEffect(() => {
        if(pathName == '/my-posts'){
            setShowEdit(true);
        }
    },[])

    return(
        <AnimatePresence>    
            <motion.div className="flex flex-col justify-center place-self-center bg-[#ecc4ff] w-[60%] m-2 py-2 px-4 rounded-xl"
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
            >
                <div id="post header">
                    <div className="flex flex-row w-full justify-between">
                        <h2 className="place-self-start font-rubik font-bold text-3xl">{Post.title}</h2>
                        {showEdit && 
                            <motion.button className="place-self-end bg-[#ff53c0] text-white rounded-md px-2 py-1">
                                Edit
                            </motion.button> 
                        }
                    </div>
                    <div id="post deets" className="flex flex-row w-full my-2">
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-row">
                                {Post.tags.map((tag) => (
                                    <p key={tag.id} className="text-xs bg-[#ff53c0] text-white rounded-full px-2 mr-2">{tag.name}</p>
                                ))}
                            </div>
                            <p className="place-self-end justify-end text-sm pl-[3px] pr-5 font-rubik">- {Post.author}</p>
                        </div>
                    </div>
                </div>
                <p className="text-base font-rubik">{Post.content}</p>
                <Votes upvotes={Post.upvotes} downvotes={Post.downvotes}/>
            </motion.div>
        </AnimatePresence>
    )

}