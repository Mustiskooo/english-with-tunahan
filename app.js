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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function loginGoogle() {

  await setPersistence(auth, browserLocalPersistence);

  await signInWithPopup(auth, provider);

  window.location.href = "dashboard.html";
}


const googleBtn = document.getElementById("google-login");

if (googleBtn) {
  googleBtn.addEventListener("click", loginGoogle);
}


export function protectPage() {

  onAuthStateChanged(auth, (user) => {

    if (!user) {
      window.location.href = "index.html";
    }

  });

}


export function getUser() {
  return auth.currentUser;
}



export function isAdmin(user) {

  return (
    user &&
    user.email === "yazicimustafayazici05@gmail.com"
  );

}



export async function logout() {

  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }

  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "index.html";

}
