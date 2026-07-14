const areaTreino = document.getElementById("areaTreino");

const DIAS_SEMANA = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
];

// ===========================
// RENDERIZA TREINOS
// ===========================

export function renderizarTreinos(
    treinos,
    exerciciosInfo,
    excluirExercicio,
    editarExercicio,
    usuarioAtual,
    mes,
    atualizarTela
) {

    areaTreino.innerHTML = "";

    DIAS_SEMANA.forEach((dia) => {

        const card = document.createElement("div");
        card.classList.add("card-dia");

        card.innerHTML = `
            <div class="cabecalho-dia">

                <h2>${dia.toUpperCase()}</h2>

                <button
                    class="btn-salvar-dia">
                    💾 Salvar Dia
                </button>

            </div>

            <div class="lista-exercicios"></div>
        `;

        const listaExercicios =
            card.querySelector(".lista-exercicios");

        if (!treinos[dia] || treinos[dia].length === 0) {

            listaExercicios.innerHTML =
                "<p>Nenhum exercício cadastrado.</p>";

        } else {

            treinos[dia].forEach((item, indice) => {

                const info =
                    exerciciosInfo[item.nome];

                const gif =
                    info?.gif || "gifs/padrao.gif";

                const grupo =
                    info?.grupo || "Não definido";

                const tipo =
                    info?.tipo || "peso";

                let texto = "Peso (kg)";

                if (tipo === "tempo") {

                    texto = "Tempo (min)";

                }

                if (tipo === "distancia") {

                    texto = "Distância (km)";

                }

                listaExercicios.innerHTML += `

                <div class="exercicio">

                    <h3>${item.nome}</h3>

                    <p>Grupo muscular: ${grupo}</p>

                    <label>${texto}</label>

                    <input
                        type="number"
                        class="peso-input"
                        value="${item.valor ?? 0}"
                    >

                    <label>Séries</label>

                    <input
                        type="number"
                        class="series-input"
                        value="${item.series ?? 0}"
                    >

                    <div class="botoes-card">

                        <button
                            class="btn-excluir"
                            data-indice="${indice}">
                            🗑 Excluir
                        </button>

                    </div>

                    <img
                        src="${gif}"
                        class="gif-exercicio">

                </div>

                `;

            });

        }

        areaTreino.appendChild(card);

        //==========================
        // BOTÃO SALVAR DIA
        //==========================

        const btnSalvarDia =
            card.querySelector(".btn-salvar-dia");

        btnSalvarDia.onclick = async () => {

            const pesos =
                card.querySelectorAll(".peso-input");

            const series =
                card.querySelectorAll(".series-input");

            try {

                for (let i = 0; i < pesos.length; i++) {

                    await editarExercicio(

                        usuarioAtual,
                        mes,
                        dia,
                        i,
                        pesos[i].value,
                        series[i].value

                    );

                }

                await atualizarTela();

                alert("Treino salvo com sucesso!");

            } catch (erro) {

                alert(erro.message);

            }

        };

        //==========================
        // BOTÃO EXCLUIR
        //==========================

        card.querySelectorAll(".btn-excluir")
            .forEach(botao => {

                botao.onclick = async () => {

                    const indice =
                        Number(botao.dataset.indice);

                    try {

                        await excluirExercicio(
                            usuarioAtual,
                            mes,
                            dia,
                            indice
                        );

                        await atualizarTela();

                        alert("Exercício excluído com sucesso!");

                    } catch (erro) {

                        alert(erro.message);

                    }

                };

            });

    });

}