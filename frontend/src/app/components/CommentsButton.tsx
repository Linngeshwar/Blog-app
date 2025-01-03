import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CommentsButton(props:{PostID: number,comments: number}) {
    const [hovered, setHovered] = useState(false);
    const pathName = usePathname();

    const redirectToPost = () => {
        window.location.href = `/post?post=${props.PostID}`;
    }

    const scrollToComments = () => {
        const comments = document.getElementById("comments");
        comments?.scrollIntoView({behavior: "smooth"});
    }
    return (
        <motion.div className="flex flex-row place-self-center mt-3 bg-[#f6e2ff] py-1 px-2 ml-5 rounded-xl"
            style={{cursor: "pointer"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={pathName === "/post" ? scrollToComments : redirectToPost}
        > 
            <svg
                className="place-self-center outline-none border-none" 
                width="15px" 
                height="15px" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                >
                <g clipPath="url(#clip0_429_11233)">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10904 20.6391 10.5124 21 12 21Z" 
                        stroke={hovered ? "#cc5fff" : "#000000"} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                />
                </g>
                <defs>
                    <clipPath id="clip0_429_11233">
                        <rect width="24" height="24" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            <p
                className="place-self-center text-xs font-rubik ml-1"
            >{props.comments}</p>
        </motion.div>
    )
}