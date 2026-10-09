let matriculasGlobais = [];
let paginaAtual = 1;
const registrosPorPagina = 5;

async function carregarMatriculas() {
    try {
        const resposta = await fetch('http://localhost:3000/matriculas');
        matriculasGlobais = await resposta.json();
        configurarPaginacao(matriculasGlobais, 5, renderizarTabela);

        const resCount = await fetch ('http://localhost:3000/matriculas/contagem');
        const count = await resCount.json();
        document.querySelector('.numbers').innerText = count.total;
        
    } catch (error) {
        console.error('Erro ao buscar as matrículas:', error)
    }
}

function renderizarTabela(matriculasSeparadas) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    matriculasSeparadas.forEach(matricula => {
        const dataFormatada = new Date(matricula.data_matricula).toLocaleDateString('pt-BR');

        let situacao = '';
        let classeCor = '';

        if (matricula.status === 'Ativo') {
            classeCor = 'ativo'
        } else {
            classeCor = 'inativo'
        }

        const linha = `
        <tr>
            <td><div id="id">#${matricula.id_matricula}</div></td>
            <td><div id="nome-email"><div class="nome">${matricula.nome_aluno}</div><div class="email">${matricula.email_aluno}</div></div></td>
            <td><div id="label-turma"><span class="material-symbols-outlined">school</span>${matricula.nome_turma}</div></td>
            <td>${dataFormatada}</td>
            <td><div id="label" class=${classeCor}>${matricula.status}</div></td>
            <td>
                <button class="btn-action-table"><span class="material-symbols-outlined" title= "Editar Dados">edit</span></button>
                <button class="btn-action-table"><span class="material-symbols-outlined" title= "Excluir Matrícula">delete</span></button>
                <button class="btn-action-table" onclick="window.location.href='boletim.html?id=${matricula.id_matricula}'" title= "Ver Boletim">
                    <span class="material-symbols-outlined">article_person</span>
                </button>
            </td>
        </tr>
        `;
        tbody.innerHTML += linha;
    });
}
// Função para buscar os alunos e turmas no banco de dados
async function carregarAlunos_Turmas() {
    try {
        // Buscando os alunos no back-end
        const resAlunos = await fetch('http://localhost:3000/alunos'); //Rota do servidor para buscar os alunos
        const alunos = await resAlunos.json(); // Armazenando os dados dos alunos no formato json
        const selectAluno = document.getElementById('aluno'); // Acessando o select de Aluno
        
        selectAluno.innerHTML = `<option value="" disabled selected>Selecione um aluno...</option>`
        alunos.forEach(aluno => {
            selectAluno.innerHTML += `<option value="${aluno.id_aluno}">${aluno.nome} (CPF: ${aluno.cpf})</option>`;
        });

        // Buscando as turmas no back-end
        const resTurmas = await fetch('http://localhost:3000/turmas'); //Rota do servidor para buscar as turmas
        const turmas = await resTurmas.json();
        const selectTurma = document.getElementById('turma') // Acessando o select de Turmas

        selectTurma.innerHTML = `<option value="" disabled selected>Selecione a turma...</option>`;
        turmas.forEach(turma => {
            selectTurma.innerHTML += `<option value="${turma.id_turma}">${turma.nome}</option>`;
        })

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar dados para o formulário:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAlunos_Turmas);
document.addEventListener('DOMContentLoaded', carregarMatriculas);

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
    document.getElementById('aluno').value = '';
    document.getElementById('turma').value = '';
    document.getElementById('data-matricula').value = '';
    document.getElementById('status').value = 'Ativo';
}

//Funcionalidade do botão Salvar Matrícula
const btnSaveRegister = document.querySelector('.btn-save');

btnSaveRegister.onclick = async function() {
    const aluno = document.getElementById('aluno').value;
    const turma = document.getElementById('turma').value;
    const dataMatricula = document.getElementById('data-matricula').value;
    const status = document.getElementById('status').value;

    if(!aluno || !turma || !dataMatricula || !status) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    const novaMatricula = {
        aluno: aluno,
        turma: turma,
        data_matricula: dataMatricula,
        status: status
    };

    try {
        const resposta = await fetch('http://localhost:3000/matriculas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaMatricula)
        });

        if(resposta.ok) {
            document.getElementById('aluno').value = '';
            document.getElementById('turma').value = '';
            document.getElementById('data-matricula').value = '';
            document.getElementById('status').value = '';

            closeModal();
            carregarAlunos_Turmas();
            carregarMatriculas();

            alert('Matrícula salva com sucesso!');
        } else {
            alert('Erro ao salvar a matrícula. Verifique...')
        }
    } catch (error) {
        console.error('Erro ao cadastrar nova matrícula', error)
    }
}

const menuDropDown = document.getElementById('options-register');

menuDropDown.onchange = function() {
    window.location.href = this.value;
};