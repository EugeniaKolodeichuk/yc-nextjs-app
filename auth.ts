import NextAuthModule from "next-auth"
import type { User, Profile, Account, Session } from "@auth/core/types"
import type { JWT } from "@auth/core/jwt"
// Normalize the import shape: some versions export a callable default, others export
// a module namespace. Coerce to `any` and prefer `.default` when present so the
// code is callable at runtime and TypeScript won't complain about the module
// lacking a call signature.
const NextAuth: any = (NextAuthModule as any)?.default ?? NextAuthModule;
import GitHub from "next-auth/providers/github"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
import { client } from "./sanity/lib/client"
import { writeClient } from "./sanity/lib/write-client"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async signIn(params: { user: User; profile?: Profile; account?: Account | null; email?: { verificationRequest?: boolean }; credentials?: Record<string, any> }) {
            const { user: { name, email, image }, profile } = params;
            const id = profile?.id as string | undefined;
            const login = profile?.login as string | undefined;
            const bio = profile?.bio as string | undefined;

            const existingUser = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

            if (!existingUser) {
                await writeClient.create({
                    _type: 'author',
                    id,
                    name,
                    username: login,
                    email,
                    image,
                    bio: bio || '',
                })
            }

            return true;
        },

        async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile; user?: User | null; trigger?: string; isNewUser?: boolean; session?: any }) {
            if (account && profile) {
                const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                    id: profile?.id,
                });

                // `token` is a generic JWT object; we augment it with an `id` field for later session use.
                ; (token as any).id = user?._id;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            Object.assign(session, { id: (token as any).id });
            return session;
        }
    }
})