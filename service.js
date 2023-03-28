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

  var add = 0;
  var rev = 0;
  var i = 0;

  // Valida 1o digito.
  add = 0;
  for (i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(9))) {
    return false;
  }
  // Valida 1o digito.

  // Valida 2o digito.
  add = 0;
  for (i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(10))) {
    return false;
  }
  // Valida 2o digito.

  return true;
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

const recuperarSaldosPorConta = (lancamentos) => {
  const saldos = new Map();

  for (let i = 0; i < lancamentos.length; i++) {
    const cpf = lancamentos[i].cpf;
    const valor = lancamentos[i].valor;

    const saldoAtual = saldos.get(cpf);

    if (saldoAtual !== undefined) {
      saldos.set(cpf, saldoAtual + valor);
    } else {
      saldos.set(cpf, valor);
    }
  }

  const resultado = [];

  for (const [cpf, valor] of saldos) {
    resultado.push({ cpf, valor });
  }

  return resultado;
};

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
  const menorMaior = [];

  for (let i = 0; i < lancamentos.length; i++) {
    if (lancamentos[i].cpf !== cpf) {
      continue;
    }

    if (menorMaior.length === 0) {
      menorMaior.push(lancamentos[i]);
      menorMaior.push(lancamentos[i]);
      continue;
    }

    if (lancamentos[i].valor < menorMaior[0].valor) {
      menorMaior[0] = lancamentos[i];
    }

    if (lancamentos[i].valor > menorMaior[1].valor) {
      menorMaior[1] = lancamentos[i];
    }
  }

  return menorMaior;
};

const recuperarMaioresSaldos = (lancamentos) => {
  const tresCpfsComMaioresSaldos = [];

  const saldos = recuperarSaldosPorConta(lancamentos).sort(
    (a, b) => b.valor - a.valor
  );

  tresCpfsComMaioresSaldos.push(saldos[0]);
  tresCpfsComMaioresSaldos.push(saldos[1]);
  tresCpfsComMaioresSaldos.push(saldos[2]);

  return tresCpfsComMaioresSaldos;
};

const recuperarMaioresMedias = (lancamentos) => {
  const tresCpfsComMaioresMedias = [];

  const medias = new Map();

  for (let i = 0; i < lancamentos.length; i++) {
    const cpf = lancamentos[i].cpf;
    const valor = lancamentos[i].valor;

    const obj = medias.get(cpf);

    if (obj !== undefined) {
      obj.soma += valor;
      obj.quantidade++;
      medias.set(cpf, obj);
    } else {
      medias.set(cpf, { soma: valor, quantidade: 1 });
    }
  }

  const mediasOrdenadas = [];

  for (const [cpf, obj] of medias) {
    mediasOrdenadas.push({ cpf, valor: obj.soma / obj.quantidade });
  }

  mediasOrdenadas.sort((a, b) => b.valor - a.valor);

  tresCpfsComMaioresMedias.push(mediasOrdenadas[0]);
  tresCpfsComMaioresMedias.push(mediasOrdenadas[1]);
  tresCpfsComMaioresMedias.push(mediasOrdenadas[2]);

  return tresCpfsComMaioresMedias;
};
