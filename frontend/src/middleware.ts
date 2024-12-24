import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { newToken } from "./app/util/api";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const refresh = req.cookies.get("refresh")?.value;
    const path = req.nextUrl.pathname;

    // Protected routes that require authentication
    const protectedRoutes = ['/','/posts', '/my-posts', '/profile', '/create-post'];
    
    // Routes that should redirect to posts if already authenticated
    const authRoutes = ['/', '/login', '/register'];

    try {
        // If token exists, check its validity
        if (token) {
            const decoded = jwtDecode(token);
            const isTokenExpired = decoded.exp && decoded.exp < Date.now() / 1000;
             // Token expired and refresh token also expired
            if (isTokenExpired && refresh) {
                console.log("Token and refresh token expired");
                const decodedRefresh = jwtDecode(refresh);
                const isRefreshExpired = decodedRefresh.exp && decodedRefresh.exp < Date.now() / 1000;

                if (isRefreshExpired) {
                    const response = NextResponse.redirect(new URL("/login", req.url));
                    response.cookies.delete("token");
                    response.cookies.delete("refresh");
                    return response;
                }
            }

            // Token expired and refresh token available
            if (isTokenExpired && refresh) {
                try {
                    await newToken(refresh);
                } catch (err) {
                    // If token refresh fails, redirect to login
                    return NextResponse.redirect(new URL("/login", req.url));
                }
            } 
            // Token expired and no refresh token
            else if (isTokenExpired && !refresh) {
                const response = NextResponse.redirect(new URL("/login", req.url));
                response.cookies.delete("token");
                return response;
            }

            // Redirect authenticated users from auth routes to posts
            if (authRoutes.includes(path)) {
                return NextResponse.redirect(new URL("/posts", req.url));
            }
        } 
        // No token for protected routes
        else if (protectedRoutes.includes(path)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/', '/login', '/register', '/posts', '/my-posts', '/profile', '/create-post']
}