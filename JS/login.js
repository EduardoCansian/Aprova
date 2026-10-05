const btnEnter = document.querySelector('.btn-login');
btnEnter.addEventListener('click', async function (event) {
    event.preventDefault();

    const loginDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('senha').value;

    if (!loginDigitado || !senhaDigitada) {
        alert('Por favor, preenche os campos obrigatórios!');
        return;
    }

    const credenciais = {
        login: loginDigitado,
        senha: senhaDigitada
    };

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        });

        if (resposta.ok) {
            const retorno = await resposta.json();

            alert(`Bem vindo(a), ${retorno.dados.nome_professor}!`);

            window.location.href = 'dashboard.html';

        }
        else {
            alert('Credenciais inválidas. Verifique seu Email/CPF e Senha.')
        }
    } catch (error) {
        console.error('Erro ao logar no sistema', error);
        alert('Erro ao tentar conectar com o servidor.')

    }
})