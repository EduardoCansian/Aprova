// Função para buscar os alunos no banco de dados
async function carregarDisciplinas() {
    try {
        const resposta = await fetch('http://localhost:3000/disciplinas'); //Rota do servidor
        const disciplinas = await resposta.json(); // Armazenando os dados das disciplinas no formato JSON na variável disciplinas

        const tbody = document.querySelector('tbody'); // Acessando a tabela
        tbody.innerHTML = ''; //Limpando os dados teste

        disciplinas.forEach(disciplina => {
            // Variável criada para receber todo o conteúdo nas tags HTML
            const linha = ` 
                <tr>
                    <td>#${disciplina.id_disciplina}</td>
                    <td>${disciplina.nome}</td>
                    <td>${disciplina.carga_horaria}</td>
                    <td>${disciplina.ementa}</td>
                    <td>
                        <button class="btn-action-table"><span class="material-symbols-outlined">edit</span></button>
                        <button class="btn-action-table"><span class="material-symbols-outlined">delete</span></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += linha; //Conteúdo HTML da tabela é preenchido a cada iteração do ForEach
        });

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar Disciplinas:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDisciplinas);

// Ao clicar no botão de "+ Nova Disciplina" exibirá um modal oculto com um formulário
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

// Permitindo apenas números na carga horária
const cgInput = document.getElementById('carga-horaria');
cgInput.oninput = function() {
    // Remove tudo o que não for número
    let value = cgInput.value.replace(/\D/g, '');

    //Limita o tamanho máximo a 3 números
    value = value.substring(0, 3);

    cgInput.value = value;
}

//Funcionalidade do botão Salvar Cadastro
const btnSaveRegister = document.querySelector('.btn-save');

btnSaveRegister.onclick = async function() {
    const nomeMateria = document.getElementById('nome-materia').value;
    const cargaHoraria = document.getElementById('carga-horaria').value;
    const ementa = document.getElementById('ementa').value;

    if(!nomeMateria || !cargaHoraria || !ementa) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Monta o pacote no formato JSON idêntico ao que o Node espera
    const novaDisciplina = {
        nomeMateria: nomeMateria,
        cargaHoraria: cargaHoraria,
        ementa: ementa
    };

    try {
        // Faz o envio (POST) para a rota do back-end
        const resposta = await fetch('http://localhost:3000/disciplinas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaDisciplina)
        });

        if(resposta.ok) {
            // Limpa os campos para o próximo cadastro
            document.getElementById('nome-materia').value = '';
            document.getElementById('carga-horaria').value = '';
            document.getElementById('ementa').value = '';

            closeModal();
            carregarDisciplinas(); //Atualiza a tabela na mesma hora

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