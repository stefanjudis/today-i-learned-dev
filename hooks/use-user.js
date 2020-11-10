import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOE8i9fRFWEoNJKxxwjvI0WUFaUmYwd8A",
  authDomain: "today-i-learned-dev-b6852.firebaseapp.com",
  databaseURL: "https://today-i-learned-dev-b6852.firebaseio.com",
  projectId: "today-i-learned-dev-b6852",
  storageBucket: "today-i-learned-dev-b6852.appspot.com",
  messagingSenderId: "617582590003",
  appId: "1:617582590003:web:aa7b1f105e78050f3b4b46",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const provider = new firebase.auth.GithubAuthProvider();

const LOCAL_STORAGE_USER_KEY = "renesKey";

function getUser() {
  try {
    const user = JSON.parse(localStorage[LOCAL_STORAGE_USER_KEY]);
    if (Object.keys(user).length) {
      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function getMappedUser(user) {
  try {
    const { uid, email } = user;
    const token = await user.getIdToken();
    return {
      id: uid,
      email,
      token,
    };
  } catch (error) {
    console.log("im throwing");
  }
}

const useUser = () => {
  const [user, setUser] = useState(getUser());
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
        console.log("loggedin", { user });
        // debugger;
        const mappedUser = await getMappedUser(user);
        // console.log(await user.getIdToken(true));
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(mappedUser)
        );
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
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        setUser(null);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          const mappedUser = getMappedUser(user);
          localStorage.setItem(
            LOCAL_STORAGE_USER_KEY,
            JSON.stringify(mappedUser)
          );
          setUser(mappedUser);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          setUser(null);
        }
      });

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, login, logout, error };
};

export { useUser };

// // Firebase updates the id token every hour, this
//     // makes sure the react state and the cookie are
//     // both kept up to date
//     const cancelAuthListener = firebase
//       .auth()
//       .onIdTokenChanged(async (user) => {
//         if (user) {
//           const userData = await mapUserData(user);
//           setUserCookie(userData);
//           setUser(userData);
//         } else {
//           removeUserCookie();
//           setUser();
//         }
//       });

//     const userFromCookie = getUserFromCookie();
//     if (!userFromCookie) {
//       router.push("/");
//       return;
//     }
//     setUser(userFromCookie);

//     return () => {
//       cancelAuthListener();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
