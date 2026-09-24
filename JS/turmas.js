// Função para buscar os alunos no banco de dados
async function carregarTrumas() {
    try {
        const resposta = await fetch('http://localhost:3000/turmas'); //Rota do servidor
        const turmas = await resposta.json(); // Armazenando os dados das turmas no formato JSON na variável professores

        const tbody = document.querySelector('tbody'); // Acessando a tabela
        tbody.innerHTML = ''; //Limpando os dados teste

        turmas.forEach(turma => {
            // Variável criada para receber todo o conteúdo nas tags HTML
            const linha = ` 
                <tr>
                    <td>#${turma.id_turma}</td>
                    <td>${turma.nome}</td>
                    <td>${turma.ano_letivo}</td>
                    <td>${turma.semestre}</td>
                    <td>
                        <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                        <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += linha; //Conteúdo HTML da tabela é preenchido a cada iteração do ForEach
        });

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar Turmas:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarTrumas);

// Ao clicar no botão de "+ Nova Turma" exibirá um modal oculto com um formulário
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
    input.innerText = '';
}

const anoLetivo = document.getElementById('ano-letivo');
const semestre = document.getElementById('semestre');

function onlyNumber(evento) {
    // O evento.target descobre automaticamente em qual caixa o utilizador está digitando
    evento.target.value = evento.target.value.replace(/\D/g, '');
}

anoLetivo.addEventListener('input', onlyNumber);
semestre.addEventListener('input', onlyNumber);

//Funcionalidade do botão Salvar Cadastro
const btnSaveRegister = document.querySelector('.btn-save');

btnSaveRegister.onclick = async function() {
    const nomeTurma = document.getElementById('nome-turma').value;
    const anoLetivo = document.getElementById('ano-letivo').value;
    const semestre = document.getElementById('semestre').value;

    if(!nomeTurma || !anoLetivo || !semestre) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Monta o pacote no formato JSON idêntico ao que o Node espera
    const novaTurma = {
        nomeTurma: nomeTurma,
        anoLetivo: anoLetivo,
        semestre: semestre,
    };

    try {
        // Faz o envio (POST) para a rota do back-end
        const resposta = await fetch('http://localhost:3000/turmas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTurma)
        });

        if(resposta.ok) {
            // Limpa os campos para o próximo cadastro
            document.getElementById('nome-turma').value = '';
            document.getElementById('ano-letivo').value = '';
            document.getElementById('semestre').value = '';

            closeModal();
            carregarTrumas(); //Atualiza a tabela na mesma hora

            alert('Cadastro salvo com sucesso!');
        } else {
            alert('Erro ao salvar o cadastro. Verifique...')
        }
    } catch (error) {
        console.error('Erro ao realizar novo cadastro', error)
    }
}

const menuDropDown = document.getElementById('options-register');

menuDropDown.onchange = function() {
    window.location.href = this.value;
};