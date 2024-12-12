'use client'
import React from "react";
import { useEffect, useState } from "react";
import { getPosts } from "../util/api";

interface Post {
    id: number;
    title: string;
    content: string;
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
        });
    },[]);

    return(
        <div>
            <h1>posts</h1>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    )
}