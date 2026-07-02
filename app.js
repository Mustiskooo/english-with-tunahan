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

export async function loginGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  await signInWithPopup(auth, provider);
  window.location.href = "dashboard.html";
}


export function protectPage() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "index.html";
        return;
      }
      resolve(user);
    });
  });
}
/* adminler (#babalar sözünü tutar#) */
const ADMINS = new Set([
  "yazicimustafayazici05@gmail.com",
  "HOCANINMAİLİ@gmail.com"
]);

export function isAdmin(user) {
  return user && ADMINS.has(user.email);
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }

  window.location.href = "index.html";
}
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("google-login");

  if (!btn) {
    console.log("google-login button NOT FOUND");
    return;
  }

  btn.addEventListener("click", loginGoogle);
  console.log("Google login button bound ✔");
});
