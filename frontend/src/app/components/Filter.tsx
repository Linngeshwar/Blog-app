'use client'
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getTags } from "../util/api";
import { useSearchParams } from "next/navigation";

interface Tag {
    id: number;
    name: string;
}

export default function Filter() {
    const [showOptions, setShowOptions] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [keywords, setKeywords] = useState("");
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const QueryTags = searchParams.get("tags");
    const currentTags = QueryTags ? QueryTags.split(",").map(Number) : [];
    const keywordsString = searchParams.get("keywords");
    const keywordsQuery = keywordsString ? keywordsString.split(/\s+/) : [];
    
    const dropDownVariantsImg = {
        open: { rotate: 180, x: 8, y: 2 },
        closed: { rotate: 0, x: 0, y: 0 }
    }

    const contentVariants = {
        open: { 
            opacity: 1,
            height: "auto",
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        },
        closed: { 
            opacity: 0,
            height: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    }

    const itemVariants = {
        open: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        },
        closed: { 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.3 }
        }
    }

    const toggleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    useEffect(() => {
        const fetchTags = async () => {
            const response = await getTags();
            return response?.data;
        };
        fetchTags().then((data) => {
            setTags(data);
        });
    }, [])

    useEffect(() => {
        setSelectedTags(currentTags);
    }, [QueryTags]);

    const handleTagFilter = (e: React.FormEvent) => {
        if ((e.target as HTMLInputElement).checked) {
            setSelectedTags([...selectedTags, parseInt((e.target as HTMLInputElement).value)]);
        } else {
            setSelectedTags(selectedTags.filter((tag) => tag !== parseInt((e.target as HTMLInputElement).value)));
        }
    }

    const filterPosts = () => {
        if (selectedTags.length === 0) {
            if(keywords === ""){
                document.location.href = "/posts";
                return;
            }else{
                document.location.href = `/posts?keywords=${keywords}`;
                return;
            }
        }
        if(keywords === ""){
            const tags = selectedTags.join(",");
            document.location.href = `/posts?tags=${tags}`;
            return;
        }
        const tags = selectedTags.join(",");
        document.location.href = `/posts?tags=${tags}&keywords=${keywords}`;
    }

    const clearFilter = () => {
        setSelectedTags([]);
        setKeywords("");
        document.location.href = "/posts";
    }

    return (
        <>
            {(pathName === "/my-posts" || pathName === "/posts") && (
                <motion.div 
                    className="flex flex-col place-self-start items-center w-[20rem] mt-10 bg-[#ecc4ff] rounded-md mx-[2.5rem] overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5}}
                >
                    <motion.div 
                        className="flex flex-row px-4 w-full justify-between py-2"
                        style={{ cursor: "pointer" }}
                        onClick={toggleShowOptions}
                    >
                        <div className="flex flex-row">
                            <h1 className="text-2xl font-bold place-self-center">
                                Filter
                            </h1>
                            <FaFilter className="place-self-center ml-2 mt-[3px]" />
                        </div>
                        <motion.div
                            animate={showOptions ? "open" : "closed"}
                            variants={dropDownVariantsImg}
                        >
                            <motion.img
                                src="/dropdown.svg"
                                alt="Dropdown Icon"
                                className="place-self-center ml-2 mt-[3px]"
                                width={20}
                                height={20}
                            />
                        </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {showOptions && (
                            <motion.div
                                className="flex flex-col w-full"
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={contentVariants}
                            >
                                {tags.map((tag) => (
                                    <motion.div
                                        className="flex flex-row justify-between px-4 w-full py-[2px]"
                                        key={tag.id}
                                        variants={itemVariants}
                                    >
                                        <p className="text-md font-rubik place-self-center">
                                            {tag.name}
                                        </p>
                                        <input
                                            type="checkbox"
                                            value={tag.id}
                                            className="place-self-center w-4 h-4 border-none outline-none rounded-md"
                                            style={{
                                                cursor: "pointer",
                                                accentColor: "#ecc4ff",
                                                backgroundColor: "#ecc4ff",
                                            }}
                                            checked={selectedTags.includes(tag.id)}
                                            onChange={handleTagFilter}
                                        />
                                    </motion.div>
                                ))}
                                <motion.label className="text-sm font-rubik place-self-start px-4 py-2"
                                    variants={itemVariants}
                                >
                                    Keyword:
                                </motion.label>
                                <motion.input type="text" className="w-[90%] p-2 rounded-sm place-self-center outline-none font-rubik " 
                                    variants={itemVariants}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    defaultValue={keywordsQuery.join(" ")}
                                />
                                <motion.button
                                    className="bg-[#ecc4ff] w-[95%] m-2 py-2 px-4 rounded-md place-self-center outline-none font-rubik transition-colors duration-300 ease-in-out font-semibold hover:bg-[#d16dff] hover:text-white"
                                    variants={itemVariants}
                                    onClick={filterPosts}
                                >
                                    Apply
                                </motion.button>
                                <motion.button
                                    className="bg-[#ecc4ff] w-[95%] m-2 py-2 px-4 rounded-md place-self-center outline-none font-rubik transition-colors duration-300 ease-in-out font-semibold hover:bg-[#d16dff] hover:text-white"
                                    variants={itemVariants}
                                    onClick={clearFilter}
                                >
                                    Clear
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </>
    )
}