import { useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import firebase from "firebase/app";
import "firebase/auth";
import { useUser } from "../hooks/use-user";

export default function Home({ articles }) {
  const { user, logout, login, error } = useUser();

  console.log({ user, logout, login, error });

  return (
    <div className={styles.container}>
      <Head>
        <title>Today-I-Learned.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? (
        <>
          <span> Hello {user.email}</span>
          <button onClick={() => logout()}>Log me out of firebase</button>
        </>
      ) : (
        <button onClick={() => login()}>Log in</button>
      )}

      <main className={styles.main}>
        // add a link tofdsafdsa posts hello from stream/1
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
