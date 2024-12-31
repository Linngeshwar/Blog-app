'use client'
import { AnimatePresence, motion } from "framer-motion";
import Votes from "../components/Votes";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import { FaPen,FaTrash } from "react-icons/fa";
import EditPost from "../components/EditPost";
import { deletePost,fetchPost,findUsername } from "../util/api";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import CommentsButton from "../components/CommentsButton";


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

export default function page(){
    const searchParams = useSearchParams();
    const postID = searchParams.get("post");
    const pathName = usePathname();
    const [showEdit,setShowEdit] = useState(false);
    const [editPost,setEditPost] = useState(false);
    const [confirmDelete,setConfirmDelete] = useState(false)
    const [username,setUsername] = useState("");
    const [Post,setPost] = useState<Post>({
        id: 0,
        title: "",
        content: "",
        author: "",
        tags: [{
            id: 0,
            name: ""
        }],
        upvotes: 0,
        downvotes: 0,
        upvoted: false,
        downvoted: false
    });

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
            // console.log(username);
        }
        if(postID){     
            const fetchData = async () => {
                try {
                    const data = await fetchPost(Number(postID));
                    if (data) {
                        setPost(data.data);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    },[])

    useEffect(() => {
        if(username === Post.author){
            setShowEdit(true);
        }else{
            setShowEdit(false);
        }
    },[Post, username])

    const handleEditPost = () => {
        setEditPost(!editPost);

    }
    const toggleDelete = () => {
        setConfirmDelete(!confirmDelete)
    }
    const handleDeletePost = async () => {
        const response = await deletePost(Number(postID));
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
        <motion.div 
            className="w-full max-h-[70%] mt-20"
        >
            <AnimatePresence>  
                {editPost && <EditPost key={Post.id} id={Post.id} content={Post.content} title={Post.title} tags={Post.tags} handleEditPost={handleEditPost}/>}
            </AnimatePresence>
            <motion.div className="flex flex-col justify-center place-self-center bg-[#ecc4ff] w-[70%] max-h-[70%] mt-2 mb-10 mr-2 ml- py-4 px-5 rounded-xl overflow-scroll"
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100 }}
                            transition={{ duration: 0.5 }}
                            onClick={(e) => {e.stopPropagation()}}
            >
                <div id="post header" className="flex-shrink-0">
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
                <div className="flex-1 overflow-y-auto">
                    <p className="text-base font-rubik whitespace-break-spaces">{Post.content}</p>
                </div>
                <div className="flex flex-row justify-between" onClick={(e) => {e.stopPropagation()}}>
                    <Votes upvotes={Post.upvotes} downvotes={Post.downvotes} upvoted={Post.upvoted} downvoted={Post.downvoted} post={Post.id}/>
                    <div onClick={(e) => {e.stopPropagation()}}>
                        <CommentsButton PostID={Post.id}/>
                    </div>
                </div>
                
            </motion.div>
            <AnimatePresence>
            {confirmDelete && (
                <motion.div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {toggleDelete()}}
                >
                    <motion.div className="w-[40%] bg-[#ecc4ff] rounded-xl p-2 m-2 z-20"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="font-rubik text-2xl p-5">Are you sure you want to delete this post?</h2>
                        <div className="flex flex-row justify-end">
                            <motion.button className="bg-[#d16dff] text-white rounded-md py-2 px-5 outline-none"
                                whileHover={{ scale: 1.1 , backgroundColor: "#cc5fff"}}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {toggleDelete()}} 
                            >
                                No
                            </motion.button>
                            <motion.button className="bg-[#d16dff] text-white rounded-md py-2 ml-3 px-5 outline-none"
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
        </motion.div>
    )
}