// Função para buscar os alunos no banco de dados
async function carregarAlunos() {
    try {
        const resposta = await fetch('http://localhost:3000/alunos'); //Rota do servidor
        const alunos = await resposta.json(); // Armazenando os dados dos alunos no formato json na variável alunos

        const tbody = document.querySelector('tbody'); // Acessando a tabela
        tbody.innerHTML = ''; //Limpando os dados teste

        alunos.forEach(aluno => {
            // Formatando data para o padrão brasileiro
            const dataFormatada = new Date(aluno.data_nascimento).toLocaleDateString('pt-BR');
            // Variável criada para receber todo o conteúdo nas tags HTML
            const linha = ` 
                <tr>
                    <td>#${aluno.id_aluno}</td>
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

    } catch (error) { // Tratamento de erro personalizado
        console.error('Erro ao buscar Alunos:', error)
    }
}

// Chamando a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAlunos);

