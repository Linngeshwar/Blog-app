import { NextRequest,NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { newToken } from "./app/util/api";

export async function middleware(req: NextRequest, res: NextResponse, next: () => void) {
    const token = req.cookies.get("token")?.value;
    const refresh = req.cookies.get("refresh")?.value;
    const path = req.nextUrl.pathname;
    //token available:
    if(token){
        const decoded = jwtDecode(token);
        //token has expired:
        if((decoded.exp && decoded.exp < Date.now() / 1000) && refresh){
            try{
                await newToken(refresh);
            }catch(err){
                console.log(err);
            }
        }else if((decoded.exp && decoded.exp < Date.now() / 1000) && !refresh){
            const response = NextResponse.redirect(new URL("/login", req.nextUrl).toString());
            response.cookies.delete("token");
            return response;
        }
        //token has not expired and trying to access login or register page:
        if(path === "/login" || path === "/register" || path === "/"){
            return NextResponse.redirect(new URL("/posts",req.nextUrl).toString());
        }
    }else if(!token && path === "/posts" ){
        return NextResponse.redirect(new URL("/login",req.nextUrl).toString());
    }
}