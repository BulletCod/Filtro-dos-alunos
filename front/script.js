async function carregarAlunos() { // Fetch alunos.json Para busar os alunos no como o fetch tava com problema usei o live server do vscode
  const response = await fetch("alunos.json");
  return await response.json();
}

function calcularMedia(aluno) { // Função para calcular a média das notas do aluno
  const notas = [aluno.nota_1, aluno.nota_2, aluno.nota_3, aluno.nota_4].filter(n => n !== null);
  const soma = notas.reduce((acc, n) => acc + n, 0);
  return (notas.length > 0) ? (soma / notas.length) : 0;
}

function getStatusAluno(aluno) { // Função para determinar o status do aluno
  const media = calcularMedia(aluno);
  const faltas = aluno.faltas;

  if (media >= 7 && faltas < 7) {
    return { status: "Aprovado", motivo: null };// o que aparce na tela quando o aluno é aprovado
  } else {
    if (faltas >= 7) {
      return { status: "Reprovado", motivo: "Excesso de faltas" }; // o que aparce na tela quando o aluno é reprovado por falta
    } else {
      return { status: "Reprovado", motivo: "Média insuficiente" }; // o que aparce na tela quando o aluno é reprovado por média
    }
  }
}

function exibirResultados(lista) { // Função para exibir os resultados na tela
  const container = document.getElementById("resultados");
  container.innerHTML = ""; // Limpa os resultados anteriores

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum aluno encontrado.</p>"; // Mensagem quando não há alunos encontrados
    return;
  }

  lista.forEach(aluno => {
    const media = calcularMedia(aluno).toFixed(2); // Calcula a média e formata para duas casas decimais
    const statusInfo = getStatusAluno(aluno);// Obtém o status do aluno

    const div = document.createElement("div"); 
    div.classList.add("aluno"); 
    div.innerHTML = `
      <p><strong>${aluno.primeiro_nome} ${aluno.ultimo_nome}</strong></p> 
      <p>Média: ${media}</p>
      <p>Faltas: ${aluno.faltas}</p>
      <p>Status: <span class="${statusInfo.status === "Aprovado" ? "aprovado" : "reprovado"}">
        ${statusInfo.status}${statusInfo.motivo ? " (" + statusInfo.motivo + ")" : ""}
      </span></p>
    `;
    container.appendChild(div);
  });
}

async function buscarPorNome() { // Função para buscar alunos por nome
  const termo = document.getElementById("searchInput").value.toLowerCase(); 
  const alunos = await carregarAlunos();

  const filtrados = alunos.filter(a => // Filtra os alunos pelo termo de busca
    a.primeiro_nome.toLowerCase().includes(termo) ||
    a.ultimo_nome.toLowerCase().includes(termo)
  );

  exibirResultados(filtrados);
}

async function buscarPorMedia() { // Função para buscar alunos por média
  const valor = parseFloat(document.getElementById("searchInput").value);
  if (isNaN(valor)) {
    alert("Digite um número válido para buscar por média.");
    return;
  }

  const alunos = await carregarAlunos(); // Carrega os alunos do JSON
  // Filtra os alunos que a   média é maior ou igual ao valor informado
  const filtrados = alunos.filter(a => calcularMedia(a) >= valor);
  exibirResultados(filtrados);
}

async function buscarPorFaltas() { // Função para buscar alunos por faltas
  const valor = parseInt(document.getElementById("searchInput").value);
  if (isNaN(valor)) {
    alert("Digite um número válido para buscar por faltas.");
    return;
  }

  const alunos = await carregarAlunos();
  const filtrados = alunos.filter(a => a.faltas >= valor);
  exibirResultados(filtrados);
}
