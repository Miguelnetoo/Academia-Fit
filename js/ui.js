const areaTreino =
document.getElementById("areaTreino");

const DIAS_SEMANA = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
];

// Renderiza treinos na tela
export function renderizarTreinos(
    treinos,
    exerciciosInfo,
    excluirExercicio,
    editarPeso, 
    usuarioAtual
){
    areaTreino.innerHTML = "";

    DIAS_SEMANA.forEach(dia => {

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

            botao.onclick = async () => {

                const dia = botao.dataset.dia;

                const indice =
                Number(botao.dataset.indice);

                await excluirExercicio(
                    usuarioAtual,
                    dia,
                    indice
                );

                location.reload();

            };

            });

        card.querySelectorAll(".btn-salvar")
            .forEach(botao=>{

            botao.onclick = async () => {

                const dia = botao.dataset.dia;

                const indice =
                Number(botao.dataset.indice);

                const input =
                card.querySelectorAll(".peso-input")[indice];

                await editarPeso(

                    usuarioAtual,

                    dia,

                    indice,

                    input.value

                );

                location.reload();

            };

            });

});

    }