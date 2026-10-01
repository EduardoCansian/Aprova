async function carregarRelatorio() {
    try {
        // Lê a barra de endereços do navegador (captura tudo depois do ?)
        const parametrosUrl = new URLSearchParams(window.location.search);
        // Extrai o número exato da matrícula
        const idMatricula = parametrosUrl.get('id');

        if (parametrosUrl.get('abrirModal') === 'true') {
            modal.style.display = 'block';
            preencheSelect();
        }

        // Se abrir a tela sem um ID na URL, aborta para não dar erro
        if (!idMatricula) {
            console.error('Nenhum aluno selecionado');
            return;
        }

        // Acessa a rota do back-end passando a matrícula de um aluno específico
        // selecionada lá na tela de matrícula
        const resposta = await fetch(`http://localhost:3000/boletim/${idMatricula}`);
        const boletim = await resposta.json();

        // Preenchendo o cabeçalho:
        document.querySelector('.info-student p').innerText = boletim.aluno;
        document.getElementById('cpf-aluno').innerText = `CPF: ${boletim.cpf}`;
        document.getElementById('display-matricula').innerText = boletim.matricula;
        document.getElementById('display-turma').innerText = boletim.turma;
        document.getElementById('display-ano-letivo').innerText = boletim.ano_letivo;

        const palavras = boletim.aluno.split(" ");
        let letra1 = palavras[0][0];
        let letra2 = palavras[1][0]
        document.querySelector('.icon-indicators p').innerText = letra1 + letra2;

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        let totalFaltas = 0;
        let somaGeral = 0;
        let situacaoLista = [];

        // O Object.entries transforma o objeto de disciplinas em uma lista para o laço ler
        const listaDisciplinas = Object.entries(boletim.disciplina);
        listaDisciplinas.forEach(([nomeMateria, dados]) => {
            // Puxa a nota de cada gaveta. Se não existir nota lançada ainda, vale 0.
            const n1 = dados.notas['1° Bimestre'] || 0;
            const n2 = dados.notas['2° Bimestre'] || 0;
            const n3 = dados.notas['3° Bimestre'] || 0;
            const n4 = dados.notas['4° Bimestre'] || 0;

            // Calcula a Média Final
            const soma = parseFloat(n1) + parseFloat(n2) + parseFloat(n3) + parseFloat(n4);
            const mediaFinal = soma / 4;

            // Pegando a média final de cada matéria e adicionando na média geral
            somaGeral += mediaFinal;

            // Define a situação e a classe CSS da cor dinamicamente
            let situacao = '';
            let classeCor = '';
            // Adicionando as faltas de cada matéria no total de faltas no ano
            totalFaltas += dados.faltas_acumuladas;

            if (mediaFinal >= 7.0) {
                situacao = 'Aprovado';
                classeCor = 'aprovado'; // Classe no CSS (cor verde)
            } else {
                situacao = 'Recuperação';
                classeCor = 'recuperacao'; // (cor amarela ou vermelha)
            }
            situacaoLista.push(situacao)

            // Injeta a linha. O operador ternário (n1 ? n1 : '-') coloca um traço se não houver nota.
            tbody.innerHTML += `
                <tr>
                    <td>${nomeMateria}</td>
                    <td>${n1 ? n1 : '-'}</td>
                    <td>${n2 ? n2 : '-'}</td>
                    <td>${n3 ? n3 : '-'}</td>
                    <td>${n4 ? n4 : '-'}</td>
                    <td><strong>${mediaFinal.toFixed(1)}</strong></td>
                    <td>${dados.faltas_acumuladas}</td>
                    <td class="${classeCor}">${situacao}</td>
                </tr>
            `;
        });

        // Calculando a media geral acumulada
        const mediaFinal = somaGeral / listaDisciplinas.length;
        document.querySelector('.media strong').innerText = mediaFinal.toFixed(1);
        document.querySelector('.faltas strong').innerText = totalFaltas;

        //Dependendo da situação em cada disciplina, a Situação Geral irá mudar        
        if (situacaoLista.includes('Aprovado') && situacaoLista.includes('Recuperação')) {
            document.querySelector('.situacao p').innerText = 'Situação Geral: Aprovado com pendência em Recuperação';
        }
        else if (situacaoLista.includes('Aprovado')) {
            document.querySelector('.situacao p').innerText = 'Situação Geral: Aprovado em todas as disciplinas';
        }
        else {
            document.querySelector('.situacao p').innerText = 'Situação Geral: Em recuperação em todas as disciplinas';
        } 
        
    } catch (error) {
        console.error('Erro ao carregar o relatório desse aluno', error);
    }
}

document.addEventListener('DOMContentLoaded', carregarRelatorio);

const btnRelatorio = document.querySelectorAll('.btn-action-side-bar')[5];
const modal = document.querySelector('.modal');
const btnClose = document.querySelector('.close');

btnRelatorio.onclick = function() {
    modal.style.display = 'block';
    preencheSelect();
}

btnClose.onclick = function() {
    modal.style.display = 'none';
}

let selectAluno = document.getElementById('aluno');

// Função para preencher o select com os alunos e a turma associada
async function preencheSelect() {
    try {
        const resALunos = await fetch('http://localhost:3000/matriculas');
        const alunos = await resALunos.json();

        selectAluno.innerHTML = '<option value="" disabled selected>Selecione um aluno...</option>'
        alunos.forEach(aluno => {
            selectAluno.innerHTML += `<option value="${aluno.id_matricula}">${aluno.nome_aluno} - ${aluno.nome_turma}</option>`
        })
    } catch (error) {
        console.error('Erro ao buscar os alunos')
    }
}

const btnGeraBoletim = document.querySelector('.btn-save');

btnGeraBoletim.onclick = function() {
    const idAluno = document.getElementById('aluno').value;
    if (!idAluno) {
        alert('Por favor, selecione um aluno para gerar um boletim.')
        return;
    }
    window.location.href = 'boletim.html?id=' + idAluno;

}