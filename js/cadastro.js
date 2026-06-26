import { app, db } from "./firebase-config.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);

const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {

        mensagem.textContent =
            "As senhas não coincidem.";

        mensagem.style.color = "red";

        return;
    }

    try {

        // Cria usuário no Firebase Authentication
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        const uid = userCredential.user.uid;

        // Cria documento do usuário no Firestore
        await setDoc(
            doc(db, "usuarios", uid),
            {
                nome: nome,
                email: email,

                treinos: {
                    segunda: [],
                    terca: [],
                    quarta: [],
                    quinta: [],
                    sexta: [],
                    sabado: [],
                    domingo: []
                },

                criadoEm: new Date()
            }
        );

        mensagem.textContent =
            "Cadastro realizado com sucesso!";

        mensagem.style.color = "#00c853";

        // Aguarda 2 segundos e envia para login
        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 2000);

    } catch (error) {

        console.error(error);

        let erro = "Erro ao cadastrar.";

        switch (error.code) {

            case "auth/email-already-in-use":
                erro = "Este e-mail já está cadastrado.";
                break;

            case "auth/invalid-email":
                erro = "E-mail inválido.";
                break;

            case "auth/weak-password":
                erro = "A senha deve possuir pelo menos 6 caracteres.";
                break;

            default:
                erro = error.message;
        }

        mensagem.textContent = erro;
        mensagem.style.color = "red";
    }

});