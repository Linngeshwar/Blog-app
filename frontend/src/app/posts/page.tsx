'use client'
import React from "react";
import { useEffect, useState } from "react";
import { getPosts,findUsername } from "../util/api";
import Post from "../components/Post";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

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

export default function page(props: {tags: string}){

    const searchParams = useSearchParams();
    const tagString = searchParams.get("tags");
    const tags = tagString ? tagString.split(",").map(Number) : [];
    const titleString = searchParams.get("title");
    const title = titleString ? titleString : "";
    const [posts,setPosts] = useState<Post[]>([]);  
    // const [userID,setUserID] = useState(0);
    const [username,setUsername] = useState("");
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
        }
        const fetchPosts = async () => {
            const response = await getPosts();
            return response?.data;
        };
        if(!tags){
            fetchPosts().then((data) => {
                setPosts(data);
                console.log(data);
            });
        }else{
            fetchPosts().then((data) => {
                const filteredPosts = data.filter((post: Post) => {
                    return tags.every((tag) => 
                        post.tags.some((postTag) => 
                            postTag.id === tag
                        )
                    );
                });
                setPosts(filteredPosts);
            });
        }
    },[]);

    return(
        <div className="w-full place-self-start mt-8">
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