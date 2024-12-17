import React from "react";
import { AnimatePresence,motion } from "framer-motion";
import Votes from "./Votes";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import { FaPen,FaTrash } from "react-icons/fa";
import EditPost from "./EditPost";
import { deletePost } from "../util/api";

interface Post {
    id: number;
    title: string;
    content: string;
    author:string;
    tags:{
        id: number;
        name: string;
    }[];
    upvotes: number;
    downvotes: number;
    upvoted: boolean;
    downvoted: boolean;
}

export default function Post(Post: Post){
    const pathName = usePathname();
    const [showEdit,setShowEdit] = useState(false);
    const [editPost,setEditPost] = useState(false);
    const [confirmDelete,setConfirmDelete] = useState(false)

    useEffect(() => {
        if(pathName == '/my-posts'){
            setShowEdit(true);
        }else{
            setShowEdit(false);
        }
    },[])
    const handleEditPost = () => {
        setEditPost(!editPost);

    }
    const toggleDelete = () => {
        setConfirmDelete(!confirmDelete)
    }

    const handleDeletePost = async () => {
        const response = await deletePost(Post.id);
        if(response?.status === 204){
            window.location.reload();
        }else if(response?.status === 401){
            alert("You are not authorized to delete this post");
        }else if(response?.status === 404){
            alert("Post not found");
        }else{
            alert("An error occured");
        }
        toggleDelete();
    }

    return(
        <AnimatePresence>  
            <AnimatePresence>  
                {editPost && <EditPost key={Post.id} id={Post.id} content={Post.content} title={Post.title} tags={Post.tags} handleEditPost={handleEditPost}/>}
            </AnimatePresence>
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
                            <div>
                            <motion.button className="place-self-end bg-[#ff53c0] text-white rounded-md p-2 outline-none"
                                whileHover={{ scale: 1.1 , backgroundColor: "#cc5fff"}}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {handleEditPost()}} 
                            >
                                <FaPen/>
                            </motion.button> 
                            <motion.button className="place-self-end bg-[#ff53c0] text-white rounded-md p-2 ml-4 outline-none"
                            whileHover={{ scale: 1.1 , backgroundColor: "#cc5fff"}}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {toggleDelete()}} 
                        >
                            <FaTrash/>
                        </motion.button>
                        </div> 
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
                <Votes upvotes={Post.upvotes} downvotes={Post.downvotes} upvoted={Post.upvoted} downvoted={Post.downvoted}/>
            </motion.div>
            <AnimatePresence>
            {confirmDelete && (
                
                <motion.div 
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                    <motion.div className="w-[40%] bg-[#ecc4ff] rounded-xl p-2 m-2"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="font-rubik text-2xl p-5">Are you sure you want to delete this post?</h2>
                        <div className="flex flex-row justify-end">
                            <motion.button className="bg-[#ff53c0] text-white rounded-md py-2 px-5 outline-none"
                                whileHover={{ scale: 1.1 , backgroundColor: "#cc5fff"}}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {toggleDelete()}} 
                            >
                                No
                            </motion.button>
                            <motion.button className="bg-[#ff53c0] text-white rounded-md py-2 ml-3 px-5 outline-none"
                                whileHover={{ scale: 1.1 , backgroundColor: "#cc5fff"}}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {handleDeletePost()}} 
                            >
                                Yes
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
                
            )}
            </AnimatePresence>
        </AnimatePresence>
    )

}