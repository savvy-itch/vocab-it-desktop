import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import Head from 'next/head';
import { arialRounded } from '../lib/globals';

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
        <div className="bg-main-bg-light dark:bg-main-bg-dark text-custom-text-light dark:text-custom-text-dark transition-colors">
          <main className={`${arialRounded.className} h-[100dvh] mx-auto overflow-hidden`}>{children}</main>
        </div>
      </ThemeProvider>
    </>
  )
}