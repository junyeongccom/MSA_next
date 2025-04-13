import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

// JWT 타입 확장
interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  idToken?: string;
}

// Session 타입 확장
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    idToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent select_account",
          access_type: "offline",
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 초기 로그인 시 account 객체가 있음
      if (account) {
        // 토큰에 필요한 정보 추가
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.idToken = account.id_token;
        console.log("[NextAuth] JWT 콜백:", { token, account });
      }
      return token;
    },
    
    async session({ session, token }) {
      // token에서 session으로 데이터 전달
      const customToken = token as CustomToken;
      
      // 세션에 토큰 정보 추가
      session.accessToken = customToken.accessToken;
      session.refreshToken = customToken.refreshToken;
      session.expiresAt = customToken.expiresAt;
      session.idToken = customToken.idToken;
      console.log("[NextAuth] Session 콜백:", { session });
      return session;
    },
    
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 