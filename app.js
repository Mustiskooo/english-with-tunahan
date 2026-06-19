import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD52vq0pHWiWP3CxFZB8TpzlwcTDStDM6M",
  authDomain: "englishwithtunahan.firebaseapp.com",
  projectId: "englishwithtunahan",
  appId: "1:204561726917:web:2312ea68afce1c529d5fac"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =========================
   GOOGLE LOGIN (PERSISTENT)
========================= */
const googleBtn = document.getElementById("google-login");

if (googleBtn) {
  googleBtn.onclick = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // save user locally
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName || "",
        email: user.email || "",
        photo: user.photoURL || ""
      }));

      window.location.href = "dashboard.html";

    } catch (err) {
      console.error("Login error:", err);
    }
  };
}

/* =========================
   GUEST LOGIN
========================= */
const guestBtn = document.getElementById("guest-login");

if (guestBtn) {
  guestBtn.onclick = () => {
    localStorage.setItem("guest", "true");
    window.location.href = "dashboard.html";
  };
}

/* =========================
   OPTIONAL: GET USER
========================= */
export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

/* =========================
   LOGOUT (USE ANYWHERE)
========================= */
export function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("guest");
    window.location.href = "index.html";
  });
}
