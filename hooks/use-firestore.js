import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { getTilPostIdFromUrl } from "../utils/utils";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  });
}

const db = firebase.firestore();
const tilPostFirebaseCollection = db.collection("tilPosts");

const useFirestore = () => {
  const [tilPostsMap, setTilPostsMap] = useState({});

  const upvoteTilPostByUser = async (url, user) => {
    const tilPostId = getTilPostIdFromUrl(url);
    console.log(tilPostId);
    const tilPost = tilPostsMap[tilPostId];

    if (!tilPost) {
      const postData = {
        upvoters: [user],
      };
      await tilPostFirebaseCollection.doc(tilPostId).set(postData);
      return setTilPostsMap({ ...tilPostsMap, ...{ [tilPostId]: postData } });
    }

    const tilPostRef = tilPostFirebaseCollection.doc(tilPostId);
    const postData = {
      upvoters: [...tilPost.upvoters, user],
    };
    console.log(tilPostId, postData, {
      ...tilPostsMap,
      ...{ [tilPostId]: postData },
    });
    await tilPostRef.set(postData);
    setTilPostsMap({ ...tilPostsMap, ...{ [tilPostId]: postData } });
  };

  useEffect(() => {
    tilPostFirebaseCollection.get().then((querySnapshot) => {
      const tilPosts = {};
      querySnapshot.forEach((doc) => {
        tilPosts[doc.id] = doc.data();
      });

      setTilPostsMap(tilPosts);
    });
  }, []);

  return { tilPostsMap, upvoteTilPostByUser };
};

export default useFirestore;
