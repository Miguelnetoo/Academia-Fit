import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

/* ===========================
   REFERÊNCIA DO USUÁRIO
=========================== */

function getUsuarioRef(usuarioAtual) {

    return doc(
        db,
        "usuarios",
        usuarioAtual.uid
    );

}

/* ===========================
   CARREGAR USUÁRIO
=========================== */

async function carregarUsuario(usuarioAtual) {

    const usuarioSnap =
        await getDoc(
            getUsuarioRef(usuarioAtual)
        );

    if (!usuarioSnap.exists()) {

        throw new Error(
            "Usuário não encontrado."
        );

    }

    return usuarioSnap.data();

}

/* ===========================
   BUSCAR TREINOS
=========================== */

async function getTreinos(usuarioAtual) {

    const dados =
        await carregarUsuario(usuarioAtual);

    return dados.treinos;

}

/* ===========================
   EDITAR PESO
=========================== */

async function editarPeso(
    usuarioAtual,
    dia,
    indice,
    novoPeso
) {

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[dia][indice].valor =
    Number(novoPeso);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos: treinos
        }
    );

}

/* ===========================
   EDITAR SERIES
=========================== */

async function editarSeries(
    usuarioAtual,
    dia,
    indice,
    novaSerie
){

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[dia][indice].series =
        Number(novaSerie);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos: treinos
        }
    );

}

/* ===========================
   EXCLUIR EXERCÍCIO
=========================== */

async function excluirExercicio(
    usuarioAtual,
    dia,
    indice
) {

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[dia].splice(indice, 1);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos: treinos
        }
    );

}

/* ===========================
   EXPORTAÇÕES
=========================== */

export {

    carregarUsuario,
    getTreinos,
    editarPeso,
    editarSeries,
    excluirExercicio,
    getUsuarioRef

};