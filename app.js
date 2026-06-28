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

/* LOGIN */
export async function loginGoogle(){
  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  localStorage.setItem("user", JSON.stringify({
    name: user.displayName || "",
    email: user.email || "",
    photo: user.photoURL || ""
  }));

  window.location.href = "dashboard.html";
}

/* GUEST */
export function guestLogin(){
  localStorage.setItem("guest", "true");
  window.location.href = "dashboard.html";
}

/* AUTH GUARD */
export function protectPage(){
  onAuthStateChanged(auth, (user)=>{
    const guest = localStorage.getItem("guest");

    if(!user && !guest){
      window.location.href = "index.html";
    }
  });
}

/* USER */
export function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

/* ADMIN */
export function isAdmin(user){
  return user?.email === "seninmail@gmail.com";
}

/* LOGOUT */
export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }

  // Tüm localStorage'ı temizle
  localStorage.clear();

  // İstersen sessionStorage'ı da temizle
  sessionStorage.clear();

  window.location.href = "index.html";
}
