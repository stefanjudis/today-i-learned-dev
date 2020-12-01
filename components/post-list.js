import useUser from "../hooks/use-user";
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
const FIRESTORE_DATABASE_ID = "tilPosts";
const FIRESTORE_DATABASE = db.collection(FIRESTORE_DATABASE_ID);

const PostList = () => {
  const { user } = useUser();
  const [value, loading, error] = useCollection(
    firebase.firestore().collection(FIRESTORE_DATABASE_ID),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (!value) {
    return "loading...";
  }

  return (
    <>
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
    </>
  );
};

export default PostList;
