// Função para buscar as turmas, disciplinas e professores no banco de dados
async function carregaTurma_Disciplina_Prof() {
    try {
        // Buscando as turmas no back-end
        const resTurmas = await fetch('http://localhost:3000/turmas'); //Rota do servidor para buscar as turmas
        const turmas = await resTurmas.json();
        const selectTurma = document.getElementById('input-select-turma') // Acessando o select de Turmas

        selectTurma.innerHTML = `<option value="" disabled selected>Selecione a turma...</option>`;
        turmas.forEach(turma => {
            selectTurma.innerHTML += `<option value="${turma.id_turma}">${turma.nome}</option>`;
        })

        // Buscando as disciplinas no back-end
        const resDisciplinas = await fetch('http://localhost:3000/disciplinas'); //Rota do servidor para buscar as disciplinas
        const disciplinas = await resDisciplinas.json(); // Armazenando os dados das disciplinas no formato json
        const selectDisciplina = document.getElementById('input-select-disciplina'); // Acessando o select de disciplinas
        
        selectDisciplina.innerHTML = `<option value="" disabled selected>Selecione uma disciplina...</option>`
        disciplinas.forEach(disciplina => {
            selectDisciplina.innerHTML += `<option value="${disciplina.id_disciplina}">${disciplina.nome} - ${disciplina.ementa}</option>`;
        });

        // Buscando os professores no back-end
        const resProfessores = await fetch('http://localhost:3000/professores'); //Rota do servidor para buscar os alunos
        const professores = await resProfessores.json(); // Armazenando os dados dos professores no formato json
        const selectProfessores = document.getElementById('input-select-professor'); // Acessando o select de professores
        
        selectProfessores.innerHTML = `<option value="" disabled selected>Selecione o professor...</option>`
        professores.forEach(professor => {
            selectProfessores.innerHTML += `<option value="${professor.id_professor}">${professor.nome} - Especialidade: ${professor.especialidade}</option>`;
        });

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar dados para o formulário:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregaTurma_Disciplina_Prof);
document.addEventListener('DOMContentLoaded', carregarAlocacoes);

// Ao clicar no botão de "+ Novo Aluno" exibirá um modal oculto com um formulário
const btnAdd = document.querySelector('.btn-add-entity');
const modalContent = document.querySelector('.modal');
const close = document.querySelector('.close');
const cancel = document.querySelector('.btn-cancel');
const input = document.querySelectorAll('input');

btnAdd.onclick = function() {
    modalContent.style.display = 'block';
}

close.onclick = closeModal;
cancel.onclick = closeModal;

function closeModal() {
    modalContent.style.display = 'none';
    document.getElementById('input-select-turma').value = '';
    document.getElementById('input-select-disciplina').value = '';
    document.getElementById('input-select-professor').value = '';
}

//Funcionalidade do botão Salvar Matrícula
const btnSaveRegister = document.querySelector('.btn-save');

btnSaveRegister.onclick = async function() {
    const turma = document.getElementById('input-select-turma').value;
    const disciplina = document.getElementById('input-select-disciplina').value;
    const professor = document.getElementById('input-select-professor').value;

    if(!turma || !disciplina || !professor) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    const novaAlocacao = {
        turma: turma,
        disciplina: disciplina,
        professor: professor
    };

    try {
        const resposta = await fetch('http://localhost:3000/alocacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaAlocacao)
        });

        if(resposta.ok) {

            closeModal();
            carregaTurma_Disciplina_Prof();
            carregarAlocacoes();

            alert('Alocação de Aula salva com sucesso!');
        } else {
            alert('Erro ao salvar a Alocação de Aula. Verifique...')
        }
    } catch (error) {
        console.error('Erro ao cadastrar nova Alocação de Aula', error)
    }
}

async function carregarAlocacoes() {
    try {
        const resposta = await fetch('http://localhost:3000/alocacoes');
        const alocacoes = await resposta.json();

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        alocacoes.forEach(alocacao => {

        const linha = `
        <tr>
            <td>${alocacao.nome_turma}</td>
            <td>${alocacao.nome_disciplina}</td>
            <td>${alocacao.nome_professor}</td>
            <td>
                <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
            </td>
        </tr>
        `;

        tbody.innerHTML += linha;
    });
    } catch (error) {
        console.error('Erro ao buscar as alocações:', error)
    }
}