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
    mes,
    dia,
    indice,
    novoPeso
) {

    const treinos =
        await getTreinos(usuarioAtual);

     treinos[mes][dia][indice].valor =
        Number(novoPeso);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos
        }
    );

}

/* ===========================
   EDITAR SERIES
=========================== */

async function editarSeries(
    usuarioAtual,
    mes,
    dia,
    indice,
    novaSerie
){

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[mes][dia][indice].series =
        Number(novaSerie);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos
        }
    );

}

/* ===========================
   EXCLUIR EXERCÍCIO
=========================== */

async function excluirExercicio(
    usuarioAtual,
    mes,
    dia,
    indice
) {

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[mes][dia].splice(indice,1);

    await updateDoc(
        getUsuarioRef(usuarioAtual),
        {
            treinos
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