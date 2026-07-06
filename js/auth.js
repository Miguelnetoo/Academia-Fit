import { app } from "./firebase-config.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth(app);

/*
 * Verifica se o usuário está logado.
 * Se estiver, executa a função passada por parâmetro.
 */
export function verificarLogin(callback) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            window.location.href = "index.html";
            return;
        }

        await callback(user);

    });

}

/*
 * Faz logout do usuário
 */
export async function logout() {

    await signOut(auth);

    window.location.href = "index.html";

}