async function carregarDados() {
  const spreadsheetId = "2PACX-1vQjSWtsk-gOCwUpIh58BJoL-kjLVe6JUlV3IX5VaOX1yM0y3QHhFAFm7fPpLPwDvpDYHxrAzduqE6Cv";
  const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`;

  try {
    const response = await fetch(url);
    const csvText = await response.text();

    // Converte o CSV em um array de arrays começando a leitura da 2 linha em diante
    const linhas = parseCsv(csvText).slice(3);

    // Identifica a página atual para escolher as colunas apropriadas
    const paginaNome = window.location.pathname.split("/").pop().split(".")[0].toLowerCase();

    // Filtra e mapeia as colunas específicas com base na página
    const dadosFiltrados = linhas
      .map((linha) => {
        if (paginaNome === "aplicativos") {
          return [linha[1], linha[2], linha[3], linha[4]];
        } else if (paginaNome === "banco-de-recursos") {
          return [linha[6], linha[7], linha[8], linha[9]];
        } else if (paginaNome === "fontes") {
          return [linha[11], linha[12], linha[13], linha[14]];
        } else if (paginaNome === "freelance") {
          return [linha[16], linha[17], linha[18], linha[19]];
        } else if (paginaNome === "ia") {
          return [linha[21], linha[22], linha[23], linha[24]];
        } else if (paginaNome === "inspiracoes") {
          return [linha[26], linha[27], linha[28], linha[29]];
        } else if (paginaNome === "portfolios") {
          return [linha[31], linha[32], linha[33], linha[34]];
        } else if (paginaNome === "utilitarios") {
          return [linha[36], linha[37], linha[38], linha[39]];
        }
        return null;
      })
      .filter(Boolean) // Remove entradas nulas caso não haja correspondência
      .filter((linha) => linha.some((cell) => cell.trim() !== "")); // Remove linhas completamente vazias

    criarLinks(dadosFiltrados);
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

// Função para dividir CSV, respeitando campos com aspas que podem ter vírgulas internas
function parseCsv(text) {
  const linhas = text.split("\n");
  return linhas.map((linha) => {
    const resultado = [];
    let campo = "";
    let dentroAspas = false;

    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];

      if (char === '"' && (i === 0 || linha[i - 1] !== "\\")) {
        // Alterna o estado entre dentro e fora de aspas
        dentroAspas = !dentroAspas;
      } else if (char === "," && !dentroAspas) {
        // Se for vírgula e não está dentro de aspas, separa o campo
        resultado.push(campo);
        campo = "";
      } else {
        // Adiciona o caractere ao campo atual
        campo += char;
      }
    }

    // Adiciona o último campo da linha
    resultado.push(campo);
    return resultado;
  });
}

function criarLinks(linhas) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  linhas.forEach((linha) => {
    const [nome, url, descricao, classe] = linha;

    const link = document.createElement("a");

    // Se houver classes, divida-as e adicione ao link
    const tagsDiv = document.createElement("div");
    tagsDiv.classList.add("tags");

    if (classe) {
      const classes = classe.trim().split(/\s+/);
      classes.forEach((cls) => {
        if (cls) {
          link.classList.add(cls); // Adiciona a classe no link

          // Criar span para cada classe
          const span = document.createElement("span");
          span.classList.add(cls); // A classe vai para o span

          // Definir o texto do span conforme a classe
          span.textContent = getClassNameLabel(cls); // Texto da tag

          tagsDiv.appendChild(span); // Adiciona o span na div
        }
      });
    }

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = descricao;

    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.textContent = nome;

    div.appendChild(h2);
    link.appendChild(div);
    link.appendChild(tagsDiv);
    conteudo.appendChild(link);
  });
}

// Função para associar o nome correto à tag (sem necessidade de troca de valores na planilha)
function getClassNameLabel(cls) {
  const classNames = {
    "new": "Novo",
    "free": "Grátis",
  };

  return classNames[cls] || cls.charAt(0).toUpperCase() + cls.slice(1); // Para classes não definidas, usa a própria classe
}


carregarDados();