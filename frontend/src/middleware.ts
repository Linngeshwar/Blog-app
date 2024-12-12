import { NextRequest,NextResponse } from "next/server";

export function middleware(req: NextRequest, res: NextResponse, next: () => void) {
  console.log("middleware");
  next();
}