'use client'
import React from "react";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { AnimatePresence,motion } from "framer-motion";
import { getUserPosts } from "../util/api";
import { jwtDecode } from "jwt-decode";

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
    comments: Comments[];
}
interface Comments{
    id: number;
    content: string;
    user: string;
    created_at: string;
    post: number;
}

export default function Page() {
    const [userID, setUserID] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [noPosts, setNoPosts] = useState(false);

    useEffect(() => {
        if(typeof document !== 'undefined'){
            const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
            if (token) {
                const decodedToken = jwtDecode(token);
                const userID = (decodedToken as { user_id: number }).user_id;
                setUserID(userID);
            }
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getUserPosts(userID);
            const postData = response?.data;
            if (postData.length === 0) {
                setNoPosts(true);
            }
            console.log('Posts:', postData);
            console.log('Unique IDs:', new Set(postData.map((post: Post) => post.id)).size);
            return response?.data;
        };
        if (userID !== 0) {
            fetchPosts().then((data) => {
                setPosts(data);
            });
        }
    }, [userID]);

    return (
        <div className="w-full place-self-start mt-8">
            <AnimatePresence>
            {noPosts && 
                <motion.div
                    className="flex flex-col justify-center place-self-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <motion.p
                        className="text-2xl font-rubik font-semibold place-self-center p-3"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -200 }}
                    >
                        You have not posted anything yet
                    </motion.p>
                    <motion.p
                        className="text-xl font-rubik font-semibold place-self-center p-3"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -200 }}
                    >
                        Create a post to get started
                    </motion.p>
                    <motion.button
                        className="bg-[#ecc4ff] w-full m-2 py-2 px-4 rounded-md place-self-center outline-none"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -200 }}
                        whileHover={{ scale: 1.1 ,color: "white", backgroundColor: "#cc5fff",border: "2px solid white"}}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", damping: 10 }}
                        onClick={() => window.location.href = "/create-post"}
                    >
                        Create Post
                    </motion.button>
                </motion.div>
            }
            </AnimatePresence>
           <AnimatePresence>
                {posts.map((post) => (
                    <Post 
                        id={post.id} 
                        title={post.title} 
                        content={post.content} 
                        author={post.author} 
                        tags={post.tags} 
                        upvotes={post.upvotes} 
                        downvotes={post.downvotes} 
                        upvoted={post.upvoted}
                        downvoted={post.downvoted}
                        comments={post.comments.length}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}