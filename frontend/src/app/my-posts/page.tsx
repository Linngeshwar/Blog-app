'use client'
import React from "react";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { AnimatePresence } from "framer-motion";
import { getUserPosts } from "../util/api";

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

export default function Page() {
    const [userID, setUserID] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if(typeof document !== 'undefined'){
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
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getUserPosts(userID);
            const postData = response?.data;

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
        <div className="w-full place-self-start">
            <AnimatePresence>
                {
                posts.map((post, index) => (
                    <Post 
                        key={post.id}
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
    );
}