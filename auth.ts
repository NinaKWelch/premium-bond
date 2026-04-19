import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginResponseSchema } from '#schemas/auth.schemas';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) {
          return null;
        }

        const data = loginResponseSchema.parse(await res.json());

        return { id: data.id, email: data.email, backendToken: data.token };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account }) {
      if (account) {
        token.backendToken = user.backendToken;
      }

      return token;
    },
    session({ session, token }) {
      session.backendToken = token.backendToken;

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days, matches backend JWT
  },
});
