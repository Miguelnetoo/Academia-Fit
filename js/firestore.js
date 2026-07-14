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
   EDITAR Exercicic
=========================== */

async function editarExercicio(
    usuarioAtual,
    mes,
    dia,
    indice,
    valor,
    series
){

    const treinos =
        await getTreinos(usuarioAtual);

    treinos[mes][dia][indice].valor =
        Number(valor);

    treinos[mes][dia][indice].series =
        Number(series);

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
    editarExercicio,
    excluirExercicio,
    getUsuarioRef

};