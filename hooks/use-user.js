import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import cookies from "js-cookie";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const provider = new firebase.auth.GithubAuthProvider();

const COOKIE_KEY = "auth";

export const getUserFromCookie = () => {
  const cookie = cookies.get(COOKIE_KEY);
  if (!cookie) {
    return;
  }
  return JSON.parse(cookie);
};

export const setUserCookie = (user) => {
  cookies.set(COOKIE_KEY, user, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
  });
};

export const removeUserCookie = () => cookies.remove("auth");

async function getMappedUser(user) {
  try {
    const { uid, email } = user;
    const token = await user.getIdToken();
    return {
      id: uid,
      email,
      token,
    };
  } catch (error) {}
}

const useUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async function (result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        const mappedUser = await getMappedUser(user);
        setUserCookie(mappedUser);
        setUser(mappedUser);
      })
      .catch(function (error) {
        setError(error);
      });
  };

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        removeUserCookie();
        setUser(null);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    setUser(getUserFromCookie());

    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          const mappedUser = await getMappedUser(user);
          setUserCookie(mappedUser);
          setUser(mappedUser);
        } else {
          removeUserCookie();
          setUser(null);
        }
      });

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, login, logout, error };
};

export default useUser;
