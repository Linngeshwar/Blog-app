import React from "react";
import { motion } from "framer-motion";
import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { addComment } from "../util/api";

export default function AddComments(props: {PostID: number}){

    const [focused, setFocused] = useState(false);
    const [user, setUser] = useState(0);

    const handleFocusChange = () => {
        if(focused){
            document.getElementById("buttons")?.classList.remove("animate-fadeIn");
            document.getElementById("buttons")?.classList.add("animate-fadeOut");
            setFocused(false);
        }else if(!focused){
            setFocused(true);
            document.getElementById("commentInput")?.classList.add("animate-turnBackToInput");
            document.getElementById("buttons")?.classList.remove("animate-fadeOut");
            document.getElementById("buttons")?.classList.add("animate-fadeIn");
            const scrollY = document.getElementById("commentTextArea")?.getBoundingClientRect().top;
            if (scrollY !== undefined) {
                console.log("scrolling to ", scrollY);
                window.scrollTo(0, scrollY);
            }
        }
    }

    useEffect(() => {
        const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
        if (token) {
            const decodedToken = jwtDecode(token);
            const userid = (decodedToken as { user_id: number }).user_id;
            // console.log(userid);
            setUser(userid);
        }
    },[]); 

    const postComment = async () => {
        const content = (document.getElementById("commentContent") as HTMLTextAreaElement).value;
        if(content === ""){
            return;
        }
        try{
            const response = await addComment(content,props.PostID,String(user));
            if(response?.status === 201){
                window.location.reload();
            }else{
                console.error(response);
            }
        }catch(err){
            console.error(err);
        }
    }

    return(
        <>
            {focused ? 
                <motion.div
                    id="commentTextArea"
                    className={`flex flex-col h-32 justify-center place-self-start bg-[#e4a9ff] border-2 border-inputBorder w-full mt-2 rounded-xl px-2
                    animate-becomeTextArea`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <textarea id="commentContent" autoFocus className="outline-none bg-inherit text-sm z-10"></textarea>
                    <div id="buttons" className="flex flex-row place-self-end mt-2 justify-between animate-fadeIn">
                        <motion.button
                            className="px-3 py-1 bg-buttonPurple outline-none rounded-full hover:px-6 transition-all duration-200 ease-in-out" 
                            onClick={handleFocusChange}
                        >
                            <p style={{ transform: 'none' }}>Cancel</p>
                        </motion.button>
                        <motion.button
                            className="px-3 py-1 ml-3 bg-buttonPurple outline-none rounded-full hover:px-6 transition-all duration-200 ease-in-out" 
                            onClick={postComment}
                        >
                            <p style={{ transform: 'none' }}>Post</p>
                        </motion.button>
                    </div>
                </motion.div> 

            :   <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
            >
                    <input
                        id="commentInput" 
                        type="text" 
                        className="h-10 rounded-lg px-4 w-full mb-5 my-2 border-2 border-inputBorder bg-[#e4a9ff] animate-turnBackToInput"
                        placeholder="Add a comment..."
                        onFocus={handleFocusChange}
                    />
            </motion.div>   
            }
        </>
    )
}