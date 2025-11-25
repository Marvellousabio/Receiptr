import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb-adapter';
import bcrypt from 'bcryptjs';
import User from './models/User';
import dbConnect from './db';

declare module 'next-auth' {
   interface User {
     businessName?: string;
     address?: string;
     phone?: string;
     website?: string;
     logoUrl?: string;
     vatRate?: number;
     selectedTemplate?: string;
   }
   interface Session {
     user: {
       id: string;
       name?: string | null;
       email?: string | null;
       image?: string | null;
       businessName?: string;
       address?: string;
       phone?: string;
       website?: string;
       logoUrl?: string;
       vatRate?: number;
       selectedTemplate?: string;
     };
   }
 }

declare module 'next-auth/jwt' {
   interface JWT {
     businessName?: string;
     address?: string;
     phone?: string;
     website?: string;
     logoUrl?: string;
     vatRate?: number;
     selectedTemplate?: string;
   }
 }

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          businessName: user.businessName,
          address: user.address,
          phone: user.phone,
          website: user.website,
          logoUrl: user.logoUrl,
          vatRate: user.vatRate,
          selectedTemplate: user.selectedTemplate,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.businessName = user.businessName;
        token.address = user.address;
        token.phone = user.phone;
        token.website = user.website;
        token.logoUrl = user.logoUrl;
        token.vatRate = user.vatRate;
        token.selectedTemplate = user.selectedTemplate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.businessName = token.businessName;
        session.user.address = token.address;
        session.user.phone = token.phone;
        session.user.website = token.website;
        session.user.logoUrl = token.logoUrl;
        session.user.vatRate = token.vatRate;
        session.user.selectedTemplate = token.selectedTemplate;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};