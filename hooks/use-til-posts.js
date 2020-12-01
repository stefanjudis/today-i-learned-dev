import { useRouter } from "next/router";

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

const useTilPost = () => {
  const router = useRouter();
  const [value, loading, error] = useCollection(
    firebase.firestore().collection(FIRESTORE_DATABASE_ID),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const createTilPost = ({ data, redirectUrl }) => {
    FIRESTORE_DATABASE.doc().set(data);

    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const updateTilPost = (id, data) => {
    FIRESTORE_DATABASE.doc(id).update(data);
  };

  return {
    loading,
    tilPosts: value ? value.docs : [],
    error,
    createTilPost,
    updateTilPost,
  };
};

export default useTilPost;
