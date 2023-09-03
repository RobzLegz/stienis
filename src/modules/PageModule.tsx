import { NextPage } from "next";
import Head from "next/head";
import React from "react";

interface PageModuleProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  keywords?: string;
  className?: string;
  ogImage?: string;
  ogImageAlt?: string;
}

const PageModule: NextPage<PageModuleProps> = ({
  title,
  description = "Game of stienis",
  children,
  className,
  ogImage = "/home.jpg",
  ogImageAlt = "300",
  keywords = "Game of stienis",
}) => {
  return (
    <main className={`page ${className}`}>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:creator" content="@spotlocapp" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta property="og:type" content="website" />
        <meta property="twitter:site" content="@spotlocapp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="og:image" content={ogImage} />
        <meta property="og:site_name" content="Spotloc"></meta>
        <meta name="twitter:domain" content="spotloc.lv"></meta>
        <meta property="og:image:alt" content={ogImageAlt}></meta>
        <meta property="twitter:image:alt" content={ogImageAlt}></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Vadodara&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>

      {children}
    </main>
  );
};

export default PageModule;
