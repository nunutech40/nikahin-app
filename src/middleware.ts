import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAgencyRoute = req.nextUrl.pathname.startsWith("/agency");

        if (isAdminRoute && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (isAgencyRoute && token?.role !== "agency" && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/agency/:path*"],
};
