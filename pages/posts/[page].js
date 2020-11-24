import Head from "next/head";
import parser from "rss-url-parser";
import { tilRssFeedUrls } from "../../config";
import { useForm } from "react-hook-form";
import useUser from "../../hooks/use-user";
import SiteLayout from "../../components/site-layout";
// firebase stuff
import firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  });
}
const db = firebase.firestore();
const POSTS_PER_PAGE = 10;
const FIRESTORE_DATABASE_ID = "tilPosts";
const FIRESTORE_DATABASE = db.collection(FIRESTORE_DATABASE_ID);

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

const createTilPost = (data) => {
  FIRESTORE_DATABASE.doc().set(data);
};

export default function Home({ articles }) {
  const { user } = useUser();
  const [value, loading, error] = useCollection(
    firebase.firestore().collection(FIRESTORE_DATABASE_ID),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const { register, handleSubmit, errors } = useForm(); // initialize the hook

  if (!value) {
    return "loading...";
  }

  return (
    <SiteLayout>
      <Head>
        <title>Today-I-Learned.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Today-I-learned.dev</h1>

        <form
          onSubmit={handleSubmit((data) =>
            createTilPost({
              ...data,
              upvoters: [
                /* comment this one in, when all is cool */
                /* user.id */
              ],
            })
          )}
        >
          <label>
            Title
            <input
              name="title"
              required
              ref={register({ required: true })}
            ></input>
          </label>
          <label>
            Url
            <input
              name="url"
              type="url"
              required
              ref={register({ required: true })}
            ></input>
          </label>
          <button>Submit TIL post</button>
        </form>

        <ul>
          {value.docs.map((doc) => {
            const { url, title, upvoters } = doc.data();

            return (
              <li key={doc.id}>
                {user ? (
                  <button
                    type="button"
                    aria-live="polite"
                    aria-label={`${
                      upvoters.includes(user.id) ? "Undo vote" : "Vote"
                    } for ${title}`}
                    onClick={() => {
                      if (upvoters.includes(user.id)) {
                        const newUpvoters = upvoters.filter(
                          (userId) => userId !== user.id
                        );
                        FIRESTORE_DATABASE.doc(doc.id).update({
                          upvoters: newUpvoters,
                        });
                      } else {
                        FIRESTORE_DATABASE.doc(doc.id).update({
                          upvoters: [...upvoters, user.id],
                        });
                      }
                    }}
                  >
                    {upvoters.includes(user.id) ? "Undo vote" : "upvote"}
                  </button>
                ) : (
                  ""
                )}
                <a href={url}>
                  <span id={`${doc.id}-title`}>{title}</span>
                </a>
                <span>{upvoters.length || "0"}</span>
              </li>
            );
          })}
        </ul>
      </main>
    </SiteLayout>
  );
}
