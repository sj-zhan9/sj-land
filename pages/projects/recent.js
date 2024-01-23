import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import util from "../../styles/util.module.css";
import ProjectTile from "../../components/tiles/projectTile";
import { useRouter } from "next/router";
import Script from "next/script";

export default function RecentProjects() {
  useEffect(() => {
    let thisPage = document.querySelector("#recentProjectsPage");
    let top = sessionStorage.getItem("projects-scroll");
    if (top !== null) {
      thisPage.scrollTop = top;
    }
    const handleScroll = () => {
      sessionStorage.setItem("projects-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const description =
    "Work from 2020-2024 working full-time at Compound Planning, advising my friend’s startup and hacking personal projects over the weekends.";
  return (
    <>
      <Head>
        <title>{"SJ's Recent Projects"}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.gif" />{" "}
        <meta property="og:image" content="https://www.sj.land/og/index.png" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-T2CWC86NTK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script>

      <main id="recentProjectsPage" className={util.page}>
        <div className={util.pageColumn}>
          <h1 className={util.header}> Recent Projects</h1>
          <p
            className={util.description}
          >{`Selective work from 2020-2024, where I worked full-time as Design Lead at Compound Planning.`}</p>
          <p className={util.description}>
            {`On the side I advised a few startups: `}
            <ol>
              <li>Xyla, a Medical AI company valued at $450M</li>
              <li>
                Magik, a Y-Combinator and Jack Altman backed AI SaaS Company
              </li>
            </ol>
          </p>
          <p
            className={util.description}
          >{`Over the weekends, I built some personal projects. Orbit, a consumer social idea is one that stands out.`}</p>
          <ul className={util.list}>
            <ProjectTile
              image="compound-detailed"
              title="Compound"
              content="Wealth tech platform with $1.3B+ assets under management."
              type="Fintech · Full-time"
              url={"compound"}
              internal="true"
            />
            <ProjectTile
              image="xyla"
              title="Xyla"
              content={
                "Medical & Finance AI Company building LLMs for accuracy-critical domains."
              }
              type="AI · Advising"
              url={"xyla"}
              internal="true"
            />
            <ProjectTile
              image="orbit"
              title="Orbit"
              content={
                "A personal home page for things you love and recommend."
              }
              type="Mobile · Side Project"
              url={"orbit"}
              internal="true"
            />
            <ProjectTile
              image="magik"
              title="Magik"
              content={
                "AI startup helping team to more efficiently manage their Salesforce CRM."
              }
              type="AI · Advising"
              url={"magik"}
              internal="true"
            />
          </ul>
          <p
            className={util.tileContent}
            style={{ marginTop: "6rem", textAlign: "center" }}
          >
            {"This page is not linked up to the rest of the site."}
          </p>
        </div>
      </main>
    </>
  );
}
