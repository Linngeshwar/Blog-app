'use client'
import React from "react";
import { useEffect, useState } from "react";
import { getPosts } from "../util/api";
import Post from "../components/Post";
import { AnimatePresence } from "framer-motion";

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

    const [posts,setPosts] = useState<Post[]>([]);  
    const [userID,setUserID] = useState(0);
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
                setUserID(userID);
            }
        }
        const fetchPosts = async () => {
            const response = await getPosts();
            return response?.data;
        };
        fetchPosts().then((data) => {
            setPosts(data);
            console.log(data);
        });
    },[]);

    return(
        <div className="w-full place-self-start">
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
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}