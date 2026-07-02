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

/* login */
export async function loginGoogle() {
  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  window.location.href = "dashboard.html";
}


/* button events (guestlogin, googlelogin etc. ) */
const googleBtn = document.getElementById("google-login");
if (googleBtn) {
  googleBtn.addEventListener("click", loginGoogle);
}


/*auth guard*/
export function protectPage() {
  onAuthStateChanged(auth, (user) => {
    const guest = localStorage.getItem("guest");

    if (!user && !guest) {
      window.location.href = "index.html";
    }
  });
}

/*user things*/
export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

/* admin stuff */
export function isAdmin(user) {
  return user?.email === "yazicimustafayazici05@gmail.com"; // change with your (admin's) e-mail
}

/* logout */
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
