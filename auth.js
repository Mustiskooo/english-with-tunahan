/* bu şu işe yarıyo, bu olmadan admin.html'ye ADMİN OLMADAN VE HATTA GİRİŞ BİLE YAPMADAN girip dosya yükleyebiliyorduk (böyle hataya tüküreyim) herneyseeeeeeEEEEEEEEAAAAAAAAAAAAAAAAA, gidicem bunu düzeltmeye çalışıcam
(akıl sağlığımdan şüpheliyim, kod editörüyle konuşuyorum.) */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD52vq0pHWiWP3CxFZB8TpzlwcTDStDM6M",
  authDomain: "englishwithtunahan.firebaseapp.com",
  projectId: "englishwithtunahan",
  storageBucket: "englishwithtunahan.firebasestorage.app",
  appId: "1:204561726917:web:2312ea68afce1c529d5fac"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export function requireLogin(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.replace("index.html");
      return;
    }

    callback(user);
  });
}

export function logout() {
  signOut(auth).then(() => {
    location.replace("index.html");
  });
}
