import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import db from './db';

interface token extends JWT {
    authType: string;
};

export interface session extends Session {
    user: {
        authType: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
};

export const authOptions = {
    theme: {
        logo: "https://authjs.dev/img/logo-sm.png",
    },
    providers: [
        // facebook provider
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ""
        }),
        // Github provider
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || 'secr3t',
    /*session: {
        strategy: 'jwt'         // This is default
    },*/
    callbacks: {
        redirect: async ({ url, baseUrl }) => {
            return `${baseUrl}/update`
        },

        jwt: async ({ token, user, account }) => {
            const newToken: token = token as token;
            if (user) {
                newToken.authType = account?.provider as string;
            }
            return newToken;
        },

        session: async ({ session, token }) => {
            const newSession: session = session as session;
            if (newSession.user && token.authType) {
                newSession.user.authType = token.authType as string;
            } else {
                console.error("session error occured")
            }
            return newSession;
        },
    },

} satisfies NextAuthOptions;