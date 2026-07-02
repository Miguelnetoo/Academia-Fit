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

async function excluirExercicio(dia, indice) {

    const usuarioRef = doc(
        db,
        "usuarios",
        usuarioAtual.uid
    );

    const usuarioSnap =
    await getDoc(usuarioRef);

    let treinos =
    usuarioSnap.data().treinos;

    treinos[dia].splice(indice,1);

    await updateDoc(usuarioRef,{
        treinos:treinos
    });

    carregarUsuario();

}

async function editarPeso(
    dia,
    indice,
    novoPeso
){

    const usuarioRef =
    doc(
        db,
        "usuarios",
        usuarioAtual.uid
    );

    const usuarioSnap =
    await getDoc(usuarioRef);

    let treinos =
    usuarioSnap.data().treinos;

    treinos[dia][indice].peso =
    Number(novoPeso);

    await updateDoc(usuarioRef,{
        treinos:treinos
    });

    carregarUsuario();

}

// Renderiza treinos na tela
function renderizarTreinos(treinos) {

    areaTreino.innerHTML = "";

    const diasSemana = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
    ];

    diasSemana.forEach(dia => {

    if (!treinos[dia]) return;

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

            treinos[dia].forEach((item,indice) => {

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

                <label>Peso (kg)</label>

                <input
                    type="number"
                    class="peso-input"
                    value="${item.peso}"
                    data-dia="${dia}"
                    data-indice="${indice}"
                >

                <div class="botoes-card">

                    <button
                        class="btn-salvar"
                        data-dia="${dia}"
                        data-indice="${indice}">
                        💾 Salvar
                    </button>

                    <button
                        class="btn-excluir"
                        data-dia="${dia}"
                        data-indice="${indice}">
                        🗑 Excluir
                    </button>

                </div>

                <img

                src="${gif}"

                class="gif-exercicio"

                >

                </div>

                `;
            });

        }

        areaTreino.appendChild(card);

        card.querySelectorAll(".btn-excluir")
            .forEach(botao=>{

            botao.onclick=()=>{

            const dia=
            botao.dataset.dia;

            const indice=
            Number(
            botao.dataset.indice
            );

            excluirExercicio(
            dia,
            indice
            );

            };

            });

        card.querySelectorAll(".btn-salvar")
            .forEach(botao=>{

            botao.onclick=()=>{

            const dia=
            botao.dataset.dia;

            const indice=
            Number(
            botao.dataset.indice
            );

            const input =
            card.querySelectorAll(".peso-input")[indice];

            editarPeso(

            dia,

            indice,

            input.value

            );

            };

            });

});

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