const apiUrl = '/api/tarefas';
const form = document.getElementById('form-tarefa');
const inputTitulo = document.getElementById('input-titulo');
const inputDescricao = document.getElementById('input-descricao');
const lista = document.getElementById('lista-tarefas');
const totalTarefas = document.getElementById('total-tarefas');
const tarefasConcluidas = document.getElementById('tarefas-concluidas');
const tarefasPendentes = document.getElementById('tarefas-pendentes');
const mensagemVazia = document.getElementById('mensagem-vazia');

// Carregar tarefas
async function carregarTarefas() {
    const response = await fetch(apiUrl);
    const tarefas = await response.json();
    lista.innerHTML = '';
    if (tarefas.length === 0) {
        mensagemVazia.style.display = 'block';
    } else {
        mensagemVazia.style.display = 'none';
    }
    let concluidas = 0;
    tarefas.forEach(tarefa => {
        if (tarefa.concluida) concluidas++;
        const item = document.createElement('li');
        if (tarefa.concluida) item.className = 'concluida';
        // Header com título e botões
        const header = document.createElement('div');
        header.className = 'tarefa-header';
        const titulo = document.createElement('span');
        titulo.className = 'tarefa-titulo';
        titulo.textContent = tarefa.titulo || tarefa.descricao || 'Sem título';
        header.appendChild(titulo);
        // Botões
        const botoes = document.createElement('div');
        botoes.className = 'tarefa-botoes';
        const btnConcluir = document.createElement('button');
        btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
        btnConcluir.onclick = (e) => { e.stopPropagation(); toggleTarefa(tarefa); };
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = (e) => { e.stopPropagation(); excluirTarefa(tarefa.id); };
        botoes.appendChild(btnConcluir);
        botoes.appendChild(btnExcluir);
        header.appendChild(botoes);
        item.appendChild(header);
        // Descrição
        if (tarefa.descricao) {
            const desc = document.createElement('div');
            desc.className = 'tarefa-descricao';
            desc.textContent = tarefa.descricao;
            item.appendChild(desc);
        }
        lista.appendChild(item);
    });
    totalTarefas.textContent = tarefas.length;
    tarefasConcluidas.textContent = concluidas;
    tarefasPendentes.textContent = tarefas.length - concluidas;
}

// Adicionar tarefa
form.onsubmit = async (e) => {
    e.preventDefault();
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: inputTitulo.value, descricao: inputDescricao.value }),
    });
    inputTitulo.value = '';
    inputDescricao.value = '';
    carregarTarefas();
};

// Excluir tarefa
async function excluirTarefa(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    carregarTarefas();
}

// Alternar conclusão
async function toggleTarefa(tarefa) {
    await fetch(`${apiUrl}/${tarefa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: tarefa.titulo, descricao: tarefa.descricao, concluida: !tarefa.concluida }),
    });
    carregarTarefas();
}

carregarTarefas(); 