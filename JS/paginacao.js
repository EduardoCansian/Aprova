function configurarPaginacao(dadosGlobais, registrosPorPagina, funcaoDeDesenharTela) {
    let paginaAtual = 1;

    // Função interna que faz a matemática e chama o desenho
    function atualizarTela() {
        // 1. Faz o recorte exato da página atual
        const inicio = (paginaAtual - 1) * registrosPorPagina;
        const fim = inicio + registrosPorPagina;
        const dadosFatiados = dadosGlobais.slice(inicio, fim);

        // 2. Manda a lista fatiada de volta para o arquivo principal desenhar o HTML
        funcaoDeDesenharTela(dadosFatiados);

        // 3. Controla a ativação e numeração do rodapé
        const totalPaginas = Math.ceil(dadosGlobais.length / registrosPorPagina);
        document.getElementById('page-number').innerText = paginaAtual;
        document.getElementById('btn-prev').disabled = paginaAtual === 1;
        document.getElementById('btn-next').disabled = paginaAtual >= totalPaginas || totalPaginas === 0;
    }
    // Captura os botões
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    // Remove eventos antigos (clonando) para evitar bugs ao atualizar a tela
    const novoBtnPrev = btnPrev.cloneNode(true);
    const novoBtnNext = btnNext.cloneNode(true);
    btnPrev.parentNode.replaceChild(novoBtnPrev, btnPrev);
    btnNext.parentNode.replaceChild(novoBtnNext, btnNext);

    // Adiciona as ações de clique
    novoBtnPrev.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            atualizarTela();
        }
    });

    novoBtnNext.addEventListener('click', () => {
    const totalPaginas = Math.ceil(dadosGlobais.length / registrosPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            atualizarTela();
        }
    });

    // Chama a primeira vez para exibir a tela inicial (Página 1)
    atualizarTela();
    
}