import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ['/profile', '/']
}

export default withAuth(async (req) => {
    const token = req.nextauth.token;
    const emailId = token?.email;
    // console.log(emailId)

    const baseUrl = req.nextUrl.origin;
    const apiUrl = `${baseUrl}/api/user`;

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                email: emailId,
            })
        });
        const data = await res.json()

        if (data.status === 500) {
            return NextResponse.redirect(new URL('/api/auth/signin', req.url));
        }

        if (data.msg) {
            return NextResponse.redirect(new URL('/api/auth/signin', req.url));
        }
        // console.log(data)
    } catch (error) {
        console.error("Fetching user in middleware error: ", error)
    }
})