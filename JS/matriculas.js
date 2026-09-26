// Função para buscar os alunos e turmas no banco de dados
async function carregarAlunos_Turmas() {
    try {
        // Buscando os alunos no back-end
        const resAlunos = await fetch('http://localhost:3000/alunos'); //Rota do servidor para buscar os alunos
        const alunos = await resAlunos.json(); // Armazenando os dados dos alunos no formato json
        const selectAluno = document.getElementById('aluno'); // Acessando o select de Aluno
        
        selectAluno.innerHTML += `<option value="" disabled selected>Selecione um aluno...</option>`
        alunos.forEach(aluno => {
            selectAluno.innerHTML += `<option value="${aluno.id_aluno}">${aluno.nome} (CPF: ${aluno.cpf})</option>`;
        });

        // Buscando as turmas no back-end
        const resTurmas = await fetch('http://localhost:3000/turmas'); //Rota do servidor para buscar as turmas
        const turmas = await resTurmas.json();
        const selectTurma = document.getElementById('turma') // Acessando o select de Turmas

        selectTurma.innerHTML += `<option value="" disabled selected>Selecione a turma...</option>`;
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

async function carregarMatriculas() {
    try {
        const resposta = await fetch('http://localhost:3000/matriculas');
        const matriculas = await resposta.json();

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        matriculas.forEach(matricula => {
        const dataFormatada = new Date(matricula.data_matricula).toLocaleDateString('pt-BR');

        const linha = `
        <tr>
            <td>#${matricula.id_matricula}</td>
            <td>${matricula.nome_aluno}</td>
            <td>${matricula.nome_turma}</td>
            <td>${dataFormatada}</td>
            <td>${matricula.status}</td>
            <td>
                <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
            </td>
        </tr>
        `;

        tbody.innerHTML += linha;
    });
    } catch (error) {
        console.error('Erro ao buscar as matrículas:', error)
    }
}