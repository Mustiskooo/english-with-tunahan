import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD52vq0pHWiWP3CxFZB8TpzlwcTDStDM6M",
  authDomain: "englishwithtunahan.firebaseapp.com",
  projectId: "englishwithtunahan",
  appId: "1:204561726917:web:2312ea68afce1c529d5fac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google login
document.getElementById("google-login").onclick = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Giriş başarılı:", user.displayName);

    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Login hata:", err);
  }
};

// Guest login
document.getElementById("guest-login").onclick = () => {
  window.location.href = "dashboard.html";
};
