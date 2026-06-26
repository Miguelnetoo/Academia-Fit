import { app } from "./firebase-config.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth(app);

document.getElementById("entrar").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);

    // 🔥 SALVA O USUÁRIO
    localStorage.setItem("usuario", JSON.stringify({
      email: userCredential.user.email,
      uid: userCredential.user.uid
    }));

    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }

});