let alunosGlobais = [];
let paginaAtual = 1;
const registrosPorPagina = 5;
// Função para buscar os alunos no banco de dados
async function carregarAlunos() {
    try {
        const resposta = await fetch('http://localhost:3000/alunos'); //Rota do servidor
        alunosGlobais = await resposta.json(); // Armazenando os dados dos alunos no formato json na variável alunos
        configurarPaginacao(alunosGlobais, 5, rederizarTabela)
    
        const resCount = await fetch('http://localhost:3000/alunos/contagem');
        const count = await resCount.json();
        document.querySelector('.numbers').innerText = count.total;

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar Alunos:', error)
    }
}

function rederizarTabela(alunosFatiados) {
    const tbody = document.querySelector('tbody'); // Acessando a tabela
    tbody.innerHTML = ''; //Limpando os dados teste

    // O laço Foreach agora roda apenas nos 5 alunos separados
    alunosFatiados.forEach(aluno => {
        // Formatando data para o padrão brasileiro
        const dataFormatada = new Date(aluno.data_nascimento).toLocaleDateString('pt-BR');
        // Variável criada para receber todo o conteúdo nas tags HTML
        const linha = ` 
            <tr>
                <td><div id="id">#${aluno.id_aluno}</div></td>
                <td>${aluno.nome}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.email}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += linha; //Conteúdo HTML da tabela é preenchido a cada iteração do ForEach
    });
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAlunos);

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
    input.innerText = '';
}
// Abrir o modal de cadastro ao clicar em "Cadastrar Novo Aluno" no dashboard
const parametrosUrl = new URLSearchParams(window.location.search);

if (parametrosUrl.get('abrirModal') === 'true') {
    btnAdd.onclick();
}

// Máscara para o CPF
const cpfInput = document.getElementById('cpf');
cpfInput.oninput = function() {
    // Remove tudo o que não for número
    let value = cpfInput.value.replace(/\D/g, '');

    //Limita o tamanho máximo a 11 números
    value = value.substring(0, 11);

    // Adicionando ponto e traço a cada 3 números
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpfInput.value = value;
}

//Funcionalidade do botão Salvar Cadastro
const btnSaveRegister = document.querySelector('.btn-save');

btnSaveRegister.onclick = async function() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const email = document.getElementById('email').value;

    if(!nome || !cpf || !dataNascimento || !email) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    const novoAluno = {
        nome: nome,
        cpf: cpf,
        data_nascimento: dataNascimento,
        email: email
    };

    try {
        const resposta = await fetch('http://localhost:3000/alunos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoAluno)
        });

        if(resposta.ok) {
            document.getElementById('nome').value = '';
            document.getElementById('cpf').value = '';
            document.getElementById('data-nascimento').value = '';
            document.getElementById('email').value = '';

            closeModal();
            carregarAlunos();

            alert('Cadastro salvo com sucesso!');
        } else {
            alert('Erro ao salvar o cadastro. Verifique se o CPF ou E-mail já existem.')
        }
    } catch (error) {
        console.error('Erro ao realizar novo cadastro', error)
    }
}

const menuDropDown = document.getElementById('options-register');

menuDropDown.onchange = function() {
    window.location.href = this.value;
};



const hint = document.getElementById('hintboxEdit');
const btnEdit = document.getElementById('editar');
const btnDelete = document.getElementById('excluir');

btnEdit.addEventListener('mouseenter', () => {
    hint.textContent = 'aaa'
})

btnDelete.addEventListener('mouseenter', () => {
    hint.textContent = 'Exluir dados'
})