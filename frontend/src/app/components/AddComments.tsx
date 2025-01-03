import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AddComments(props: {PostID: number}){

    const [focused, setFocused] = useState(false);

    const handleFocusChange = () => {
        if(focused){

            setFocused(false);
        }else if(!focused){
            setFocused(true);
        }
    }
    return(
        <>
            {focused ? 
                <motion.div
                    id="commentTextArea"
                    className={`flex flex-col justify-center place-self-start bg-[#e4a9ff] border-2 border-inputBorder w-full my-2 rounded-xl py-4 px-2
                    animate-becomeTextArea`}
                >
                    <textarea className="outline-none bg-inherit text-sm z-10"></textarea>
                    <div className="flex flex-row place-self-end mt-2 justify-between">
                        <motion.button
                            className="px-3 py-1 bg-buttonPurple outline-none rounded-full hover:px-6 transition-all duration-200 ease-in-out" 
                            onClick={() => setFocused(false)}
                        >
                            <p style={{ transform: 'none' }}>Cancel</p>
                        </motion.button>
                        <motion.button
                            className="px-3 py-1 ml-3 bg-buttonPurple outline-none rounded-full hover:px-6 transition-all duration-200 ease-in-out" 
                            // onClick={() => setFocused(false)}
                        >
                            <p style={{ transform: 'none' }}>Post</p>
                        </motion.button>
                    </div>
                </motion.div> 

            :   <motion.div>
                    <input
                        id="commentInput" 
                        type="text" 
                        className="h-10 rounded-lg px-4 w-full mb-5 border-2 border-inputBorder bg-[#e4a9ff]"
                        placeholder="Add a comment..."
                        onFocus={() => setFocused(true)}
                    />
            </motion.div>   
            }
        </>
    )
}