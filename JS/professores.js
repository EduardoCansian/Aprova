// Função para buscar os alunos no banco de dados
async function carregarProfessores() {
    try {
        const resposta = await fetch('http://localhost:3000/professores'); //Rota do servidor
        const professores = await resposta.json(); // Armazenando os dados dos professores no formato JSON na variável professores

        const tbody = document.querySelector('tbody'); // Acessando a tabela
        tbody.innerHTML = ''; //Limpando os dados teste

        professores.forEach(professor => {
            // Variável criada para receber todo o conteúdo nas tags HTML
            const linha = ` 
                <tr>
                    <td>#${professor.id_professor}</td>
                    <td>${professor.nome}</td>
                    <td>${professor.cpf}</td>
                    <td>${professor.email}</td>
                    <td>${professor.especialidade}</td>
                    <td>
                        <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                        <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += linha; //Conteúdo HTML da tabela é preenchido a cada iteração do ForEach
        });

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar Professores:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarProfessores);

// Ao clicar no botão de "+ Novo Professor" exibirá um modal oculto com um formulário
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
    const especialidade = document.getElementById('especialidade').value;
    const email = document.getElementById('email').value;

    if(!nome || !cpf || !especialidade || !email) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Monta o pacote no formato JSON idêntico ao que o Node espera
    const novoProfessor = {
        nome: nome,
        cpf: cpf,
        especialidade: especialidade,
        email: email
    };

    try {
        // Faz o envio (POST) para a rota do back-end
        const resposta = await fetch('http://localhost:3000/professores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProfessor)
        });

        if(resposta.ok) {
            // Limpa os campos para o próximo cadastro
            document.getElementById('nome').value = '';
            document.getElementById('cpf').value = '';
            document.getElementById('especialidade').value = '';
            document.getElementById('email').value = '';

            closeModal();
            carregarProfessores(); //Atualiza a tabela na mesma hora

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