'use client'
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { findUsername, deleteDownvote, deleteUpvote, upvotePost, downvotePost } from "../util/api";

interface Props {
  upvotes: number;
  downvotes: number;
  upvoted: boolean;
  downvoted: boolean;
  post: number;
}

export default function Votes({ upvotes, downvotes, upvoted, downvoted, post }: Props) {
  const [votes, setVotes] = useState({
    upvotes : upvotes,
    downvotes : downvotes,
    upvoted : upvoted,
    downvoted : downvoted
  });
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVotes({
        upvotes: upvotes,
        downvotes: downvotes,
        upvoted: upvoted,
        downvoted: downvoted
    });
  }, [upvotes, downvotes, upvoted, downvoted]);

  useEffect(() => {
    const tokenCookie = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        const userID = (decodedToken as { user_id: number }).user_id;

        const fetchUsername = async () => {
          const response = await findUsername(Number(userID));
          if (response?.data.username) {
            setUsername(response.data.username);
          }
        };

        fetchUsername();
      } catch (err) {
        console.error("Invalid JWT token:", err);
      }
    }
  }, []);

  const handleVote = useCallback(async (voteType: 'upvote' | 'downvote') => {
    if (isLoading || !username) return;

    setIsLoading(true);
    
    // Store previous state for rollback
    const previousState = { ...votes };
    
    try {
      // Optimistic update
      setVotes(current => {
        const newState = { ...current };
        
        if (voteType === 'upvote') {
          if (current.upvoted) {
            newState.upvotes -= 1;
            newState.upvoted = false;
          } else {
            newState.upvotes += 1;
            newState.upvoted = true;
            if (current.downvoted) {
              newState.downvotes -= 1;
              newState.downvoted = false;
            }
          }
        } else {
          if (current.downvoted) {
            newState.downvotes -= 1;
            newState.downvoted = false;
          } else {
            newState.downvotes += 1;
            newState.downvoted = true;
            if (current.upvoted) {
              newState.upvotes -= 1;
              newState.upvoted = false;
            }
          }
        }
        
        return newState;
      });

      // Make API calls
      if (voteType === 'upvote') {
        if (votes.upvoted) {
          await deleteUpvote(post, username);
        } else {
          if (votes.downvoted) {
            await Promise.all([
              upvotePost(post, username),
              deleteDownvote(post, username)
            ]);
          } else {
            await upvotePost(post, username);
          }
        }
      } else {
        if (votes.downvoted) {
          await deleteDownvote(post, username);
        } else {
          if (votes.upvoted) {
            await Promise.all([
              downvotePost(post, username),
              deleteUpvote(post, username)
            ]);
          } else {
            await downvotePost(post, username);
          }
        }
      }
    } catch (error) {
      console.error('Vote action failed:', error);
      // Rollback to previous state if API call fails
      setVotes(previousState);
    } finally {
      setIsLoading(false);
    }
  }, [votes, username, post, isLoading]);

  return (
    <motion.div
      className="flex flex-row w-fit rounded-xl transition-all duration-300 ease-in-out mt-3"
      style={{ 
        backgroundColor: votes.upvoted ? "#cc5fff47" : votes.downvoted ? "#ff53c049" : "#f6e2ff",
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? 'none' : 'auto'
      }}
    >
      <div
        className="group cursor-pointer px-2 pt-1 rounded-full hover:bg-[#cc5fff47] transition-colors duration-300 ease-in-out"
        onClick={() => handleVote('upvote')}
      >
        <svg
          fill={votes.upvoted ? "#cc5fff" : "#000000"}
          className="group-hover:fill-[#cc5fff] transition-colors"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="15px"
          height="15px"
          viewBox="0 0 429.658 429.658"
        >
            <g>
                <g>
                    <path 
                    className={`group-hover:fill-[#cc5fff] transition-colors`}
                    d={votes.upvoted ?"M235.252,13.406l-0.447-0.998c-3.417-7.622-11.603-12.854-19.677-12.375l-0.3,0.016l-0.302-0.016 C214.194,0.011,213.856,0,213.524,0c-7.706,0-15.386,5.104-18.674,12.413l-0.452,0.998L13.662,176.079 c-6.871,6.183-6.495,12.657-4.971,16.999c2.661,7.559,10.361,13.373,18.313,13.82l1.592,0.297c0.68,0.168,1.356,0.348,2.095,0.427 c23.036,2.381,45.519,2.876,64.472,3.042l5.154,0.048V407.93c0,11.023,7.221,15.152,11.522,16.635l0.967,0.33l0.77,0.671 c3.105,2.717,7.02,4.093,11.644,4.093h179.215c4.626,0,8.541-1.376,11.639-4.093l0.771-0.671l0.965-0.33 c4.307-1.482,11.532-5.611,11.532-16.635V210.706l5.149-0.048c18.961-0.17,41.446-0.666,64.475-3.042 c0.731-0.079,1.407-0.254,2.082-0.422l1.604-0.302c7.952-0.447,15.65-6.262,18.312-13.82c1.528-4.336,1.899-10.811-4.972-16.998 L235.252,13.406z" :"M235.252,13.406l-0.447-0.998c-3.417-7.622-11.603-12.854-19.677-12.375l-0.3,0.016l-0.302-0.016 C214.194,0.011,213.856,0,213.524,0c-7.706,0-15.386,5.104-18.674,12.413l-0.452,0.998L13.662,176.079 c-6.871,6.183-6.495,12.657-4.971,16.999c2.661,7.559,10.361,13.373,18.313,13.82l1.592,0.297c0.68,0.168,1.356,0.348,2.095,0.427 c23.036,2.381,45.519,2.876,64.472,3.042l5.154,0.048V407.93c0,11.023,7.221,15.152,11.522,16.635l0.967,0.33l0.77,0.671 c3.105,2.717,7.02,4.093,11.644,4.093h179.215c4.626,0,8.541-1.376,11.639-4.093l0.771-0.671l0.965-0.33 c4.307-1.482,11.532-5.611,11.532-16.635V210.706l5.149-0.048c18.961-0.17,41.446-0.666,64.475-3.042 c0.731-0.079,1.407-0.254,2.082-0.422l1.604-0.302c7.952-0.447,15.65-6.262,18.312-13.82c1.528-4.336,1.899-10.811-4.972-16.998 L235.252,13.406z M344.114,173.365c-11.105,0.18-22.216,0.254-33.337,0.254c-5.153,0-9.363,1.607-12.507,4.768 c-3.372,3.4-5.296,8.48-5.266,13.932l0.005,0.65l-0.157,0.629c-0.437,1.767-0.64,3.336-0.64,4.928v194.001H137.458V198.526 c0-1.597-0.201-3.161-0.638-4.928l-0.157-0.629l0.005-0.65c0.031-5.456-1.892-10.537-5.271-13.937 c-3.141-3.161-7.353-4.763-12.507-4.768c-11.124,0-22.224-0.074-33.337-0.254l-13.223-0.218L214.834,44.897l142.503,128.249 L344.114,173.365z" }
                    />
                </g>
            </g>
        </svg>
      </div>
      <p className="text-md font-rubik" style={{ cursor: "default" }}>
        {votes.upvotes - votes.downvotes}  
      </p>
      <div
        className="group cursor-pointer px-2 pt-[5px] rounded-full hover:bg-[#ff53c049] transition-colors duration-300 ease-in-out"
        onClick={() => handleVote('downvote')}
      >
        <svg
          fill={votes.downvoted ? "#ff53c0" : "#000000"}
          className="group-hover:fill-[#ff53c0] transition-colors"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="15px"
          height="15px"
          viewBox="0 0 429.658 429.658"
          transform="rotate(180)"
        >
            <g>
                <g>
                    <path
                    className="group-hover:fill-[#ff53c0] transition-colors"
                    d={votes.downvoted ?"M235.252,13.406l-0.447-0.998c-3.417-7.622-11.603-12.854-19.677-12.375l-0.3,0.016l-0.302-0.016 C214.194,0.011,213.856,0,213.524,0c-7.706,0-15.386,5.104-18.674,12.413l-0.452,0.998L13.662,176.079 c-6.871,6.183-6.495,12.657-4.971,16.999c2.661,7.559,10.361,13.373,18.313,13.82l1.592,0.297c0.68,0.168,1.356,0.348,2.095,0.427 c23.036,2.381,45.519,2.876,64.472,3.042l5.154,0.048V407.93c0,11.023,7.221,15.152,11.522,16.635l0.967,0.33l0.77,0.671 c3.105,2.717,7.02,4.093,11.644,4.093h179.215c4.626,0,8.541-1.376,11.639-4.093l0.771-0.671l0.965-0.33 c4.307-1.482,11.532-5.611,11.532-16.635V210.706l5.149-0.048c18.961-0.17,41.446-0.666,64.475-3.042 c0.731-0.079,1.407-0.254,2.082-0.422l1.604-0.302c7.952-0.447,15.65-6.262,18.312-13.82c1.528-4.336,1.899-10.811-4.972-16.998 L235.252,13.406z" :"M235.252,13.406l-0.447-0.998c-3.417-7.622-11.603-12.854-19.677-12.375l-0.3,0.016l-0.302-0.016 C214.194,0.011,213.856,0,213.524,0c-7.706,0-15.386,5.104-18.674,12.413l-0.452,0.998L13.662,176.079 c-6.871,6.183-6.495,12.657-4.971,16.999c2.661,7.559,10.361,13.373,18.313,13.82l1.592,0.297c0.68,0.168,1.356,0.348,2.095,0.427 c23.036,2.381,45.519,2.876,64.472,3.042l5.154,0.048V407.93c0,11.023,7.221,15.152,11.522,16.635l0.967,0.33l0.77,0.671 c3.105,2.717,7.02,4.093,11.644,4.093h179.215c4.626,0,8.541-1.376,11.639-4.093l0.771-0.671l0.965-0.33 c4.307-1.482,11.532-5.611,11.532-16.635V210.706l5.149-0.048c18.961-0.17,41.446-0.666,64.475-3.042 c0.731-0.079,1.407-0.254,2.082-0.422l1.604-0.302c7.952-0.447,15.65-6.262,18.312-13.82c1.528-4.336,1.899-10.811-4.972-16.998 L235.252,13.406z M344.114,173.365c-11.105,0.18-22.216,0.254-33.337,0.254c-5.153,0-9.363,1.607-12.507,4.768 c-3.372,3.4-5.296,8.48-5.266,13.932l0.005,0.65l-0.157,0.629c-0.437,1.767-0.64,3.336-0.64,4.928v194.001H137.458V198.526 c0-1.597-0.201-3.161-0.638-4.928l-0.157-0.629l0.005-0.65c0.031-5.456-1.892-10.537-5.271-13.937 c-3.141-3.161-7.353-4.763-12.507-4.768c-11.124,0-22.224-0.074-33.337-0.254l-13.223-0.218L214.834,44.897l142.503,128.249 L344.114,173.365z" }
                    />
                </g>
            </g>
        </svg>
      </div>
    </motion.div>
  );
}