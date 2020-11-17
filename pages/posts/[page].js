import Head from "next/head";
import parser from "rss-url-parser";
import { tilRssFeedUrls } from "../../config";
import useFirestore from "../../hooks/use-firestore";
import useUser from "../../hooks/use-user";
import { getTilPostIdFromUrl } from "../../utils/utils";

const POSTS_PER_PAGE = 10;

async function getRssArticles() {
  return (await Promise.all(tilRssFeedUrls.map(async (url) => parser(url))))
    .flat()
    .filter(({ pubDate }) => !!pubDate)
    .sort((a, b) => b.pubDate - a.pubDate);
}

export async function getStaticProps({ params }) {
  const pageNumber = +params.page;

  const articles = (await getRssArticles()).slice(
    (pageNumber - 1) * POSTS_PER_PAGE,
    pageNumber * POSTS_PER_PAGE
  );

  console.log(articles[0]);

  return {
    props: {
      articles: articles.map(({ date, link, title }) => ({
        title,
        link,
        date: date.toISOString().substr(0, 10),
      })),
    },
  };
}

export async function getStaticPaths() {
  const articles = await getRssArticles();
  const pages = Math.ceil(articles.length / POSTS_PER_PAGE);
  const paths = new Array(pages)
    .fill("")
    .map((nothing, index) => ({ params: { page: `${index + 1}` } }));

  return {
    paths,
    fallback: false,
  };
}

export default function Home({ articles }) {
  const { user, logout, login, error } = useUser();
  const { tilPostsMap, upvoteTilPostByUser } = useFirestore();

  return (
    <div>
      <Head>
        <title>Today-I-Learned.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Today-I-learned.dev</h1>

        <ul>
          {articles.map(({ date, link, title }) => (
            <li key={title}>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    upvoteTilPostByUser(link, user.email);
                  }}
                >
                  upvote this article
                </button>
              ) : (
                ""
              )}
              <a href={link}>{title}</a>
              <span>
                {tilPostsMap[getTilPostIdFromUrl(link)]
                  ? tilPostsMap[getTilPostIdFromUrl(link)].upvoters.length
                  : "0"}
              </span>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
  );
}
