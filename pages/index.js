import Head from "next/head";
// import styles from "../styles/Home.module.css";
import "firebase/auth";
import useUser from "../hooks/use-user";
import SiteLayout from "../components/site-layout";
import Container from "../components/container";
import PostList from "../components/post-list";

export default function Home() {
  const { user, logout, login, error } = useUser();

  return (
    <SiteLayout>
      <Head>
        <title>Today-I-Learned.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <h1>Today I learned</h1>
          <PostList />
        </main>
      </Container>
    </SiteLayout>
  );
}
