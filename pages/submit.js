import { useForm } from "react-hook-form";
import useTilPosts from "../hooks/use-til-posts";
import Head from "next/head";
import SiteLayout from "../components/site-layout";
import Container from "../components/container";

export default function Submit() {
  const { register, handleSubmit, errors } = useForm();
  const { createTilPost } = useTilPosts();

  return (
    <SiteLayout>
      <Head>
        <title>Today-I-Learned.dev | Submit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <h1>Submit your stuff</h1>
          <form
            onSubmit={handleSubmit((data) =>
              createTilPost({
                data: {
                  ...data,
                  upvoters: [
                    /* comment this one in, when all is cool */
                    /* user.id */
                  ],
                },
                redirectUrl: "/",
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
        </main>
      </Container>
    </SiteLayout>
  );
}
