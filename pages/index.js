import Head from "next/head";
import styles from "../styles/Home.module.css";
import "firebase/auth";
import useUser from "../hooks/use-user";

export default function Home() {
  const { user, logout, login, error } = useUser();

  return (
    <div className={styles.container}>
      <Head>
        <title>Today-I-Learned.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        // add a link tofdsafdsa posts hello from stream/1
      </main>
    </div>
  );
}
