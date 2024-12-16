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
}

export default function page(){

    const [posts,setPosts] = useState<Post[]>([]);  
    useEffect(() => {
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
                    <Post key={post.id} title={post.title} content={post.content} author={post.author} tags={post.tags} upvotes={post.upvotes} downvotes={post.downvotes}/>
                ))}
                {/* <Post key={4} title="big title which definitely is so big that it overflows to the next line"
                        content="lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc ultricies ultricies lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec nunc ultricies ultricies"
                        author="author" tags={["tag1","tag2"]} upvotes={0} downvotes={0}/> */}
            </AnimatePresence>
        </div>
    )
}