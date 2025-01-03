import React from "react";
import { AnimatePresence, motion } from "framer-motion";


interface Comments{
    id: number;
    content: string;
    user: string;
    created_at: string;
    post: number;
}

export default function Comments(comments: Comments){
    return(
        <>
            <AnimatePresence>
                <motion.div
                    key={comments.id}
                    className="flex flex-col justify-center place-self-start bg-[#e4a9ff] w-full my-2 rounded-xl py-4 px-2  "
                >
                    <p className="font-rubik text-[11px]">{comments.user} says...  </p>
                    <p className="font-rubik text-[14px] my-2">{comments.content} </p>
                </motion.div>
            </AnimatePresence>
        </>
    )
}