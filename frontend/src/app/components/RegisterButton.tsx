import {motion} from "framer-motion";

export default function RegisterButton() {
    return(
        <motion.button className="bg-[#cc5fff] text-white rounded-full px-4 place-self-center py-2 font-rubik" 
            onClick={() => {document.location.href = "/register"}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >Register</motion.button>
    )
}