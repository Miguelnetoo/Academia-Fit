/* ===========================
   VARIÁVEIS
=========================== */

let exerciciosInfo = {};

/* ===========================
   FUNÇÃO
=========================== */

async function carregarExercicios() {

    const resposta =
        await fetch("data/exercicios.json");

    const exercicios =
        await resposta.json();

    const select =
        document.getElementById("listaExercicios");

    // Evita duplicar opções ao recarregar
    select.innerHTML = "";

    const grupos = {};

    exercicios.forEach(exercicio => {

        // Guarda as informações do exercício
        exerciciosInfo[exercicio.nome] = {

            gif: exercicio.gif,
            grupo: exercicio.grupo

        };

        // Cria o grupo muscular
        if (!grupos[exercicio.grupo]) {

            const optgroup =
                document.createElement("optgroup");

            optgroup.label =
                exercicio.grupo;

            grupos[exercicio.grupo] =
                optgroup;

            select.appendChild(optgroup);

        }

        // Cria a opção do select
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

/* ===========================
   EXPORTAÇÕES
=========================== */

export {

    carregarExercicios,
    exerciciosInfo

};