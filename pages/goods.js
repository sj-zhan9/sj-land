import Head from "next/head";
import util from "../styles/util.module.css";
import GoodsTile from "../components/tiles/goodsTile";
const { Client } = require("@notionhq/client");
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Settings from "../components/settings";

export default function Goods({ list }) {
  const description =
    "With a high bar for build quality, aesthetic, and usability. Here are some of the goods that I own or researched.";

  //filtering logic depends on query params
  //if no query we assume the section is "recently added" and fav setting is "false"
  //if you toggle section or fav setting, the changed setting will be reflected in param
  //removing filter param triggers all and "overview"
  const router = useRouter();
  const [filter, setFilter] = React.useState(null);
  const [fav, setFav] = React.useState(null);
  const [currentList, setCurrentList] = React.useState(null);

  useEffect(() => {
    let thisPage = document.querySelector("#goodsPage");
    let top = sessionStorage.getItem("goods-scroll");
    if (top !== null) {
      thisPage.scrollTop = top;
    }
    const handleScroll = () => {
      sessionStorage.setItem("goods-scroll", thisPage.scrollTop);
    };
    thisPage.addEventListener("scroll", handleScroll);
    return () => thisPage.removeEventListener("scroll", handleScroll);
  }, []);

  const filters = ["Tech", "Home", "Workspace", "Watches", "Fashion"];

  //handlers to handle filter and fav setting changes
  function removeFilter() {
    setFilter("all");
  }
  function handleTagChange(e) {
    setFilter(e.target.innerHTML);
  }

  //set initial states when url has queries
  useEffect(() => {
    if (router.query.filter && router.query.filter !== filter) {
      setFilter(router.query.filter);
    }
  }, [router.query.filter]);
  useEffect(() => {
    if (router.query.favonly) {
      if (fav == false) {
        setFav(true);
      }
    } else {
      setFav(false);
    }
  }, [router.query.favonly]);
  //set initial state when url has no queries
  useEffect(() => {
    //preset filter when there's no filter in url, but data stored in local storage
    if (router && router.query.filter == null) {
      let filterSelected = sessionStorage.getItem("goods-filter");
      if (filterSelected && filterSelected !== filter) {
        setFilter(filterSelected);
      } else {
        setFilter("all");
      }
    }
    //set fav when no filter in url, but in the same session
    if (router && router.query.favonly == null) {
      let favSelected = sessionStorage.getItem("goods-fav");
      if (favSelected == "true") {
        setFav(true);
      } else {
        setFav(false);
      }
    }
  }, []);

  useEffect(() => {
    if (filter && fav !== null) {
      //cycle through scenarios and compose lists
      let tempList = [];
      if (filter !== "all" && !fav) {
        router.push({
          query: { filter: filter },
        });
        sessionStorage.setItem("goods-filter", filter);
        sessionStorage.setItem("goods-fav", false);
        for (var i = 0; i < list.length; i++) {
          for (
            var j = 0;
            j < list[i].properties.Tags.multi_select.length;
            j++
          ) {
            if (
              list[i].properties.Tags.multi_select[j].name ==
              filter.replace("&amp;", "&")
            ) {
              tempList.push(list[i]);
            }
          }
        }
      } else if (filter !== "all" && fav) {
        router.push({
          query: { filter: filter, favonly: fav },
        });
        sessionStorage.setItem("goods-filter", filter);
        sessionStorage.setItem("goods-fav", true);
        for (var i = 0; i < list.length; i++) {
          for (
            var j = 0;
            j < list[i].properties.Tags.multi_select.length;
            j++
          ) {
            if (
              list[i].properties.Tags.multi_select[j].name ==
                filter.replace("&amp;", "&") &&
              list[i].properties.Fav.checkbox == fav
            ) {
              tempList.push(list[i]);
            }
          }
        }
      } else if (filter == "all" && fav) {
        router.push({
          query: { favonly: fav },
        });
        sessionStorage.setItem("goods-filter", "all");
        sessionStorage.setItem("goods-fav", true);
        for (var i = 0; i < list.length; i++) {
          if (list[i].properties.Fav.checkbox == fav) {
            tempList.push(list[i]);
          }
        }
      } else if (filter == "all" && !fav) {
        router.push({
          query: {},
        });
        sessionStorage.setItem("goods-filter", "all");
        sessionStorage.setItem("goods-fav", false);
        for (var i = 0; i < list.length; i++) {
          tempList.push(list[i]);
        }
      }
      setCurrentList(tempList);
    }
  }, [filter, fav]);

  return (
    <>
      <Head>
        <title>{"Aesthetic Goods"}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.gif" />{" "}
        <meta property="og:image" content="https://www.sj.land/og/index.png" />
      </Head>

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-T2CWC86NTK"
      ></script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
       window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-T2CWC86NTK');
        `}
      </Script>

      <main className={util.page} id="goodsPage">
        <div className={util.goodsColumn}>
          <div className={util.goodsTopContainer}>
            <div className={util.projectTopLeft}>
              <h1 className={util.goodsHeader}>Aesthetic Goods</h1>
            </div>
            <p className={util.goodsDescription}>{description}</p>
          </div>

          <div className={util.tabBar}>
            <div className={util.tabRow}>
              <button
                onClick={removeFilter}
                className={util.tab}
                role="tab"
                aria-selected={filter == "all" ? "true" : null}
              >
                Recently Added
              </button>
              {filters.map((filterName) => (
                <button
                  key={filterName}
                  onClick={handleTagChange}
                  className={util.tab}
                  role="tab"
                  aria-selected={
                    filter
                      ? filterName == filter.replace("&amp;", "&")
                        ? "true"
                        : null
                      : null
                  }
                >
                  {filterName}
                </button>
              ))}
            </div>
            <Settings status={fav} updateCheckbox={setFav} />
          </div>
          {currentList ? (
            currentList.length == 0 ? (
              <div className={util.emptyState}>
                Nothing found. Please try adjusting the filter.
              </div>
            ) : (
              <ul className={util.fullWidthGrid}>
                {currentList.map((link) => (
                  <GoodsTile
                    key={link.id}
                    title={link.properties.Name.title[0].plain_text}
                    url={link.properties.URL.url}
                    date={link.created_time}
                    note={link.properties.Note.rich_text}
                    fav={link.properties.Fav.checkbox}
                    tags={link.properties.Tags.multi_select}
                    thumbnailUrl={link.properties.Thumbnail.files[0].file.url}
                    price={link.properties.Price.number}
                    brand={link.properties.Brand.rich_text[0].plain_text}
                  />
                ))}
              </ul>
            )
          ) : (
            <p>loading...</p>
          )}
        </div>
      </main>
    </>
  );
}

// notion API
export async function getStaticProps() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const response = await notion.databases.query({
    database_id: process.env.NOTION_GOODS_ID,
    filter: {
      and: [
        {
          property: "Display",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Created",
        direction: "descending",
      },
    ],
  });

  return {
    props: {
      list: response.results,
    },
    revalidate: 5,
  };
}
