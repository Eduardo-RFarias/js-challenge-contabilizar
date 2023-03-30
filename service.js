//* <Funções de validação de dados>

function isDefined(value) {
  return value !== null && value !== undefined;
}

function isInt(value) {
  const valueToValidate = parseInt(value);
  return !isNaN(valueToValidate) && isFinite(valueToValidate);
}

function isNumber(value) {
  const valueToValidate = parseFloat(value);
  return !isNaN(valueToValidate) && isFinite(valueToValidate);
}

function validarDigitoVerificador(value) {
  const cpf = value.toString().trim();

  // Verifica se o cpf tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se o cpf não pertece a uma sequência de números iguais
  if (cpf[0].repeat(11) === cpf) {
    return false;
  }

  let soma1 = 0;

  // Soma os 9 primeiros dígitos, multiplicando-os por 1, 2, 3, ..., 9
  for (let i = 0; i < 9; i++) {
    soma1 += parseInt(cpf[i], 10) * (i + 1);
  }

  // Calcula o resto da divisão da soma por 11
  let resto1 = soma1 % 11;

  // Se o resto for 10, o dígito verificador será 0
  if (resto1 === 10) {
    resto1 = 0;
  }

  let soma2 = 0;

  // Soma os 10 primeiros dígitos, multiplicando-os por 0, 1, 2, ..., 9
  for (let i = 0; i < 10; i++) {
    soma2 += parseInt(cpf[i], 10) * i;
  }

  // Calcula o resto da divisão da soma por 11
  let resto2 = soma2 % 11;

  // Se o resto for 10, o dígito verificador será 0
  if (resto2 === 10) {
    resto2 = 0;
  }

  // Verifica se os dígitos verificadores são iguais aos dígitos do cpf
  // note o uso de == ao invés de ===, pois estamos comparando números com strings
  if (resto1 == cpf[9] && resto2 == cpf[10]) {
    return true;
  } else {
    return false;
  }
}

function isCpf(value) {
  if (!isDefined(value)) {
    return "CPF não informado";
  }

  if (!isInt(value)) {
    return "CPF deve ser numérico";
  }

  if (!validarDigitoVerificador(value)) {
    return "CPF inválido";
  }

  return null;
}

function isBetween(value, min, max) {
  if (!isDefined(value)) {
    return "Valor não informado";
  }

  if (!isNumber(value)) {
    return "Valor deve ser numérico";
  }

  if (value < min || value > max) {
    return `Valor deve estar entre ${min} e ${max}`;
  }

  return null;
}

//* <Funções de validação de dados/>

const validarEntradaDeDados = (lancamento) => {
  let cpf = lancamento.cpf;
  let valor = lancamento.valor;

  // os erros são armazenados em um array para facilitar a concatenação
  const erros = [];

  // Para um cpf ser válido, ele deve ser numérico e passar na validação de dígito verificador
  const validacaoCpf = isCpf(cpf);

  // Para um valor ser válido, ele deve ser numérico e estar entre -2000 e 15000
  const validacaoValor = isBetween(valor, -2000, 15000);

  if (validacaoCpf !== null) {
    erros.push(validacaoCpf);
  }

  if (validacaoValor !== null) {
    erros.push(validacaoValor);
  }

  // se o array de erros não estiver vazio, retorna uma string com os erros concatenados
  // Ex:
  //      CPF inválido.
  //      Valor deve estar entre -2000 e 15000.
  if (erros.length > 0) {
    return erros.join(".\n") + ".";
  }

  // se não houver erros, retorna null
  return null;
};

/*
  O Map é uma estrutura de dados que permite armazenar dados em pares chave-valor.
  Nesse caso, a chave é o CPF e o valor é um objeto com as informações da conta,
  as informações incluem a soma, a média, o maior e o menor lançamento.
  Podemos considerar que os métodos utilizados no programa (get e set) são O(1).
*/
const contas = new Map();

/*
  Função que organiza as informações dos lançamentos em um Map.
  A complexidade dessa função é O(n), onde n é o número de lançamentos.
*/
function organizarInformacoes(lancamentos) {
  console.time("organizarInformações");

  // para cada lançamento, execute a seguinte lógica
  for (let lancamento of lancamentos) {
    let cpf = lancamento.cpf;
    let valor = lancamento.valor;

    const conta = contas.get(cpf);

    // se a conta não existir, cria uma nova conta.
    if (conta === undefined) {
      contas.set(cpf, {
        // soma é o valor do lançamento
        soma: valor,
        // começamos com 1 lançamento
        numeroLancamentos: 1,
        // a média é o valor do lançamento, pois valor / 1 = valor
        media: valor,
        // o maior e o menor valor são o valor do lançamento, pois não temos outros valores.
        maior: valor,
        menor: valor,
      });
    }
    // se a conta existir, atualiza as informações da conta.
    else {
      // soma o valor do lançamento ao saldo da conta
      conta.soma += valor;

      // incrementa o número de lançamentos
      conta.numeroLancamentos++;

      // calcula a média, considerando a nova soma e o novo número de lançamentos
      conta.media = conta.soma / conta.numeroLancamentos;

      // atualiza o maior valor lançado
      conta.maior = valor > conta.maior ? valor : conta.maior;

      // atualiza o menor valor lançado
      conta.menor = valor < conta.menor ? valor : conta.menor;
    }
  }

  console.timeEnd("organizarInformações");
}

/*
  Função que recupera os saldos de cada conta.
  A complexidade dessa função é O(k), onde k é o número de contas (cpfs).
*/
const recuperarSaldosPorConta = (lancamentos) => {
  organizarInformacoes(lancamentos);

  console.time("recuperarSaldosPorConta");

  const saldos = [];

  // Esse for-of itera sobre cada uma das contas e recupera o cpf (key) e as informações da conta (value).
  for (let [cpf, conta] of contas) {
    saldos.push({
      cpf,
      valor: conta.soma,
    });
  }

  console.timeEnd("recuperarSaldosPorConta");

  return saldos;
};

/*
  Função que recupera o maior e o menor saldo de uma conta específica.
  A complexidade dessa função é O(1).
*/
const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
  console.time("recuperarMaiorMenorLancamentos");

  const conta = contas.get(cpf);

  if (conta === undefined) {
    return [];
  }

  const resultado = [
    { cpf, valor: conta.menor },
    { cpf, valor: conta.maior },
  ];

  console.timeEnd("recuperarMaiorMenorLancamentos");

  return resultado;
};

/*
  Função que recupera os três maiores saldos.
  A complexidade dessa função é O(k), onde k é o número de contas (cpfs).
*/
const recuperarMaioresSaldos = (lancamentos) => {
  console.time("recuperarMaioresSaldos");

  let primeiro;
  let segundo;
  let terceiro;

  for (let [cpf, conta] of contas) {
    // se o saldo da conta for maior que o saldo do primeiro, atualiza os três maiores.
    if (primeiro === undefined || conta.soma > primeiro.valor) {
      terceiro = segundo;
      segundo = primeiro;
      primeiro = { cpf, valor: conta.soma };
    }
    // se o saldo da conta for maior que o saldo do segundo, atualiza o segundo e o terceiro.
    else if (segundo === undefined || conta.soma > segundo.valor) {
      terceiro = segundo;
      segundo = { cpf, valor: conta.soma };
    }
    // se o saldo da conta for maior que o saldo do terceiro, atualiza o terceiro.
    else if (terceiro === undefined || conta.soma > terceiro.valor) {
      terceiro = { cpf, valor: conta.soma };
    }
  }

  const resultado = [];

  if (primeiro !== undefined) {
    resultado.push(primeiro);
  }

  if (segundo !== undefined) {
    resultado.push(segundo);
  }

  if (terceiro !== undefined) {
    resultado.push(terceiro);
  }

  console.timeEnd("recuperarMaioresSaldos");

  return resultado;
};

/*
  Função que recupera as três maiores médias.
  A complexidade dessa função é O(k), onde k é o número de contas (cpfs).
*/
const recuperarMaioresMedias = (lancamentos) => {
  console.time("recuperarMaioresMedias");

  let primeiro;
  let segundo;
  let terceiro;

  for (let [cpf, conta] of contas) {
    // se a média da conta for maior que a média do primeiro, atualiza os três maiores.
    if (primeiro === undefined || conta.media > primeiro.valor) {
      terceiro = segundo;
      segundo = primeiro;
      primeiro = { cpf, valor: conta.media };
    }
    // se a média da conta for maior que a média do segundo, atualiza o segundo e o terceiro.
    else if (segundo === undefined || conta.media > segundo.valor) {
      terceiro = segundo;
      segundo = { cpf, valor: conta.media };
    }
    // se a média da conta for maior que a média do terceiro, atualiza o terceiro.
    else if (terceiro === undefined || conta.media > terceiro.valor) {
      terceiro = { cpf, valor: conta.media };
    }
  }

  const resultado = [];

  if (primeiro !== undefined) {
    resultado.push(primeiro);
  }

  if (segundo !== undefined) {
    resultado.push(segundo);
  }

  if (terceiro !== undefined) {
    resultado.push(terceiro);
  }

  console.timeEnd("recuperarMaioresMedias");

  return resultado;
};
