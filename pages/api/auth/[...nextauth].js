import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import {FirebaseAdapter} from "@next-auth/firebase-adapter";
import { db } from "../../../firebase";

export default NextAuth({
    session: {
      jwt: true,
  },
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Credentials({
      name: 'Email',
      credentials: {
        username: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch(process.env.NEXTAUTH_URL+"/api/credentialsLogin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json();
        if (res.ok && user) {
          console.log(user);
          return user;
        }
        return null;
      }
    })
  ],
  adapter: FirebaseAdapter(db)
})