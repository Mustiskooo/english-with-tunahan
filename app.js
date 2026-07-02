/* dsc */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD52vq0pHWiWP3CxFZB8TpzlwcTDStDM6M",
  authDomain: "englishwithtunahan.firebaseapp.com",
  projectId: "englishwithtunahan",
  appId: "1:204561726917:web:2312ea68afce1c529d5fac"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

/* google login işlemleri */

export async function loginGoogle() {
  await setPersistence(auth, browserLocalPersistence);

  await signInWithPopup(auth, provider);

  location.replace("dashboard.html");
}

/* login butonu */

const googleBtn = document.getElementById("google-login");

if (googleBtn) {
  googleBtn.addEventListener("click", loginGoogle);
}

/* güvenlik kulübesi (auth guard) */

export function protectPage(callback) {
  onAuthStateChanged(auth, (user) => {

    if (!user) {
      location.replace("index.html");
      return;
    }

    callback(user);

  });
}

/* güvenlik kulübesi (admin check) */

export function isAdmin(user) {
  return user?.email === "yazicimustafayazici05@gmail.com";
}

/* logout işlemleri */

export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.error(e);
  }

  location.replace("index.html");
}
