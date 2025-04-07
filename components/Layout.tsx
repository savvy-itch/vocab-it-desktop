import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { arialRounded } from '@/lib/globals';

import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children }: { children: ReactNode}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn new words and build you own vocabularies"
        />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="bg-main-bg-light dark:bg-main-bg-dark transition-colors">
          <Navbar />
          <main className={`${arialRounded.className} min-h-screen mx-auto flex flex-col justify-between pt-28 mobile:pt-[10rem]`}>{children}</main>
        </div>
      </ThemeProvider>
    </>
  )
}