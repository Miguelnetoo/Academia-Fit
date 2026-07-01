import { app, db } from "./firebase-config.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);

let exerciciosInfo = {};

async function carregarExercicios() {

    const resposta =
        await fetch("data/exercicios.json");

    const exercicios =
        await resposta.json();

    const select =
        document.getElementById("listaExercicios");

    const grupos = {};

    exercicios.forEach(exercicio => {

        // Salva informações para usar depois
        exerciciosInfo[exercicio.nome] = {

            gif: exercicio.gif,
            grupo: exercicio.grupo

        };

        // Cria grupo se não existir
        if (!grupos[exercicio.grupo]) {

            const optgroup =
                document.createElement("optgroup");

            optgroup.label =
                exercicio.grupo;

            grupos[exercicio.grupo] =
                optgroup;

            select.appendChild(optgroup);

        }

        // Cria opção
        const option =
            document.createElement("option");

        option.value =
            exercicio.nome;

        option.textContent =
            exercicio.nome;

        grupos[exercicio.grupo]
            .appendChild(option);

    });

}

await carregarExercicios();
const select =
document.getElementById("listaExercicios");

const nomeUsuario =
document.getElementById("nomeUsuario");

const areaTreino =
document.getElementById("areaTreino");

const btnLogout =
document.getElementById("logout");

const btnAdicionar =
document.getElementById("adicionarExercicio");

btnAdicionar.addEventListener(
    "click",
    async () => {

        try {

            const dia =
            document.getElementById(
                "diaSemana"
            ).value;

            const exercicio =
            document.getElementById(
                "listaExercicios"
            ).value;

            const peso =
            Number(
            document.getElementById(
                "pesoExercicio"
            ).value
            );

            console.log("Usuário:", usuarioAtual);
            console.log("Dia:", dia);
            console.log("Exercício:", exercicio);

            const usuarioRef =
            doc(
                db,
                "usuarios",
                usuarioAtual.uid
            );

            console.log(
                "Documento:",
                usuarioAtual.uid
            );

            await updateDoc(
                usuarioRef,
                {
                    [`treinos.${dia}`]:
                    arrayUnion({
                        nome: exercicio,
                        peso: peso
                    })
                }
            );

            alert(
                "Exercício adicionado com sucesso!"
            );

            await carregarUsuario();

        } catch (erro) {

            console.error(
                "ERRO COMPLETO:",
                erro
            );

            alert(
                "Erro: " +
                erro.message
            );

        }

    }
);

let usuarioAtual = null;

// Verifica login
onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    usuarioAtual = user;

    await carregarExercicios();

    await carregarUsuario();

});

// Carrega dados do Firestore
async function carregarUsuario() {

    try {

        const usuarioRef =
        doc(
            db,
            "usuarios",
            usuarioAtual.uid
        );

        const usuarioSnap =
        await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {

            alert("Usuário não encontrado.");
            return;

        }

        const dados =
        usuarioSnap.data();

        nomeUsuario.textContent =
        `Olá, ${dados.nome}`;

        renderizarTreinos(
            dados.treinos
        );

    } catch (erro) {

        console.error(erro);

    }

}

// Renderiza treinos na tela
function renderizarTreinos(treinos) {

    areaTreino.innerHTML = "";

    for (const dia in treinos) {

        const card =
        document.createElement("div");

        card.classList.add("card-dia");

        card.innerHTML = `
            <h2>${dia.toUpperCase()}</h2>
            <div class="lista-exercicios"></div>
        `;

        if (treinos[dia].length === 0) {

            card.innerHTML +=
            "<p>Nenhum exercício cadastrado.</p>";

        } else {

            const listaExercicios =
                card.querySelector(".lista-exercicios");

            treinos[dia].forEach(item => {

                const info =
                exerciciosInfo[item.nome];

                const gif =
                info?.gif ||
                "gifs/padrao.gif";

                const grupo =
                info?.grupo ||
                "Não definido";

                listaExercicios.innerHTML += `
                    <div class="exercicio">

                    <h3>${item.nome}</h3>

                <p>
                    Grupo muscular:
                    ${grupo}
                </p>
                <p>
                    Peso: ${item.peso} kg
                </p>

                    <img
                        src="${gif}"
                        alt="${item.nome}"
                        class="gif-exercicio"
                    >

                </div>
            `;

            });

        }

        areaTreino.appendChild(card);

    }

}

// Logout
btnLogout.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.href =
        "index.html";

    }
);