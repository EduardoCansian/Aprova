async function carregarTurmas_Disciplinas() {
    try {
        const resTurmas = await fetch('http://localhost:3000/turmas');
        const turmas = await resTurmas.json();
        const selectTurma = document.getElementById('select-turma');

        selectTurma.innerHTML = `<option value="" disabled selected>Selecione a turma</option>`
        turmas.forEach(turma => {
            selectTurma.innerHTML += `<option value="${turma.id_turma}">${turma.nome}</option>`
        });

        const resDisciplinas = await fetch('http://localhost:3000/disciplinas');
        const disciplinas = await resDisciplinas.json();
        const selectDisciplinas = document.getElementById('select-disciplina');

        selectDisciplinas.innerHTML = `<option value="" disabled selected>Selecione a disciplina</option>`
        disciplinas.forEach(disciplina => {
            selectDisciplinas.innerHTML += `<option value="${disciplina.id_disciplina}">${disciplina.nome}</option>`
        });
        
    } catch (error) {
        console.error('Erro ao buscar turmas/disciplinas', error)
    }
}

document.addEventListener('DOMContentLoaded', carregarTurmas_Disciplinas);

const selectTurma = document.getElementById('select-turma');
selectTurma.addEventListener('change', carregarNomeAluno);

async function carregarNomeAluno() {
    const idTurmaSel = selectTurma.value;
    if (!idTurmaSel) return;

    try {
        const resposta = await fetch(`http://localhost:3000/alunos/turma/${idTurmaSel}`);
        const alunos = await resposta.json();

        const tbody = document.querySelector('tbody')
        tbody.innerHTML = '';

        alunos.forEach(aluno => {
            const partesNome = aluno.nome_aluno.split(' ');
            let letra1 = partesNome[0][0];
            let letra2 = partesNome[1][0] 

            // if (partesNome.length > 1) {
            //     iniciais += partesNome[partesNome.length - 1][0];
            // }
            let iniciais = letra1 + letra2;
            tbody.innerHTML += `
            <tr>
                <td class="nome">
                    <div class="aluno-info">
                        <div class="avatar-iniciais">${iniciais.toUpperCase()}</div>
                        <div>
                            ${aluno.nome_aluno} <br>
                            <small style="color: #aeaeae;">Matrícula: #${aluno.id_matricula}</small>
                        </div>
                    </div> 
                </td>
                <td><input type="number" step="0.1" min="0" max="10" class="input-nota" data-matricula="${aluno.id_matricula}"> pts</td>
                <td><input type="number" min="0" class="input-falta" data-matricula="${aluno.id_matricula}"></td>
            </tr>
            `
        });
    } catch (error) {
        console.error('Erro ao buscar o nome dos alunos', error)
    }
}

const btnSave = document.querySelector('.btn-save');
btnSave.addEventListener('click', salvaNotas);

async function salvaNotas() {
    const idTurma = document.getElementById('select-turma').value;
    const idDisciplina = document.getElementById('select-disciplina').value;
    const tipoAvaliacao = document.getElementById('select-avaliacao').value;

    if (!idTurma || !idDisciplina || !tipoAvaliacao) {
        alert('Por favor, preencha os filtros de TURMA, DISCIPLINA e AVALIAÇÃO no topo');
        return;
    }
    // Captura todas as notas e faltas geradas na tabela
    const inputsNotas = document.querySelectorAll('.input-nota');
    const inputsFaltas = document.querySelectorAll('.input-falta');
    const alunosLancamentos = [];

    // Passa por todos os inputs e guarda quem teve nota ou falta preenchida
    inputsNotas.forEach((inputNota, index) => {
        const notaStr = inputNota.value;
        const faltaStr = inputsFaltas[index].value;
        const matricula = inputNota.getAttribute('data-matricula');

        // Se o professor digitou nota ou falta, adiciona na lista de envio
        if (notaStr !== '' || faltaStr !== '') {
            alunosLancamentos.push({
                id_matricula: matricula,
                nota: notaStr ? parseFloat(notaStr) : null,
                faltas: faltaStr ? parseInt(faltaStr) : 0
            });
        }
    });

    if (alunosLancamentos.length === 0) {
        alert('Por favor, digite ao menos uma nota ou falta na tabela para salvar')
        return;
    }
    // Monta o pacote final com o contexto (disciplina e avaliação) e os dados dos alunos
    novoLancamento = {
        id_disciplina: idDisciplina,
        tipo_avaliacao: tipoAvaliacao,
        alunos: alunosLancamentos
    };

    try {
        const resposta = await fetch('http://localhost:3000/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(novoLancamento)
        });

        if (resposta.ok) {
            alert('Notas salvas com sucesso!');
        }
        else {
            alert('Erro ao salvar os lançamentos no servidor');
        }
            
    } catch (error) {
        console.error('Erro ao salvar lançamento de nota e frequência', error)
    }
}
const tbodyNotas = document.querySelector('tbody');

tbodyNotas.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada foi o "Enter"
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o navegador de tentar enviar um formulário ou quebrar a linha
        
        // Mapeia todos os inputs numéricos (notas e faltas) que existem dentro da tabela no momento
        const inputs = Array.from(tbodyNotas.querySelectorAll('input[type="number"]'));
        
        // Descobre a posição (índice) do input onde o cursor do professor está agora
        const indexAtual = inputs.indexOf(event.target);
        
        // Se encontrar o input atual e ele não for o último da lista, move o foco para o próximo
        if (indexAtual > -1 && indexAtual < inputs.length - 1) {
            inputs[indexAtual + 1].focus();
        }
    }
});