/* ===========================
   IMPORTAÇÕES
=========================== */

import { app, db } from "./firebase-config.js";

import {
    doc,
    updateDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    verificarLogin,
    logout
} from "./auth.js";

import {
    carregarExercicios,
    exerciciosInfo
} from "./exercicios.js";

import {
    carregarUsuario,
    editarPeso,
    editarSeries,
    excluirExercicio
} from "./firestore.js";

import {
    renderizarTreinos
} from "./ui.js";

/* ===========================
   ELEMENTOS HTML
=========================== */

const $ = (id) => document.getElementById(id);

const nomeUsuario = $("nomeUsuario");
const btnAdicionar = $("adicionarExercicio");
const btnLogout = $("logout");

/* ===========================
   VARIÁVEIS
=========================== */

let usuarioAtual = null;

/* ===========================
   INICIALIZAÇÃO
=========================== */

await carregarExercicios();

verificarLogin(async (user) => {

    usuarioAtual = user;

    atualizarTela();

});

/* ===========================
   EVENTOS
=========================== */

btnAdicionar.addEventListener("click", adicionarExercicio);

btnLogout.addEventListener("click", logout);

/* ===========================
   FUNÇÕES
=========================== */

async function adicionarExercicio() {

    try {

        const dia = $("diaSemana").value;

        const exercicio =
            $("listaExercicios").value;

        const valor =
            Number($("pesoExercicio").value);

        const series =
            Number($("seriesExercicio").value);

        const usuarioRef =
            doc(
                db,
                "usuarios",
                usuarioAtual.uid
            );

        console.log("Vai salvar...");
        console.log(dia);
        console.log(exercicio);
        console.log(valor);

        await updateDoc(usuarioRef,{

            [`treinos.${dia}`]:
            arrayUnion({

                nome: exercicio,
                valor: valor,
                series: series

            })

        });

console.log("Salvou com sucesso!");

        await atualizarTela();

        alert("Exercício adicionado!");

    }

    catch (erro) {

        alert(erro.message);

    }

}

async function atualizarTela() {

    const dados =
        await carregarUsuario(usuarioAtual);

    nomeUsuario.textContent =
        `Olá, ${dados.nome}`;

    renderizarTreinos(
    dados.treinos,
    exerciciosInfo,
    excluirExercicio,
    editarPeso,
    editarSeries,
    usuarioAtual
);

}