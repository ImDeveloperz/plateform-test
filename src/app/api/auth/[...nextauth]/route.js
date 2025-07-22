import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials : ", process.env)
        console.log("credentials : ", process.env.ADMIN_GMAIL)
        console.log("credentials : ", process.env.ADMIN_PASSWORD)

        const isValid =
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD;

        if (isValid) {
          return { id: "admin", name: "Bouchra" }; // session.user.id & user.name
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // optional, create a /login UI
  },
});

export { handler as GET, handler as POST };
