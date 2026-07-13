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
const hoje = new Date();

$("mesTreino").value =
    hoje.toISOString().slice(0, 7);

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

$("mesTreino").addEventListener("change", () => {

    atualizarTela();

});

/* ===========================
   FUNÇÕES
=========================== */

async function adicionarExercicio() {

    try {

        const dia = $("diaSemana").value;

        const mes =
        $("mesTreino").value;

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

            [`treinos.${mes}.${dia}`]:
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

    const mes =
        $("mesTreino").value;

    const treinosMes =
    dados.treinos?.[mes] || {
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
        domingo: []
    };

    nomeUsuario.textContent =
        `Olá, ${dados.nome}`;

    renderizarTreinos(
        treinosMes,
        exerciciosInfo,
        excluirExercicio,
        editarPeso,
        editarSeries,
        usuarioAtual,
        mes,
        atualizarTela
);

}