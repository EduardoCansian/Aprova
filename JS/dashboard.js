// Função para preencher os contadores no dashboard
async function carregarContagem() {
    try {
        const resAlunos = await fetch('http://localhost:3000/alunos/contagem');
        const alunos = await resAlunos.json();
        document.getElementById('num-alunos').innerText = alunos.total;

        const resProfessores = await fetch('http://localhost:3000/professores/contagem');
        const professores = await resProfessores.json();
        document.getElementById('num-professores').innerText = professores.total;
        
        const resTurmas = await fetch('http://localhost:3000/turmas/contagem');
        const turmas = await resTurmas.json();
        document.getElementById('num-turmas').innerText = turmas.total
    } catch (error) {
        console.error('Erro ao carregar contadores do dashboard:', error);
    }
}
document.addEventListener('DOMContentLoaded', carregarContagem);