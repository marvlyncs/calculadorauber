import { buscarRegistros } from './database.js';

// Filtrar registros por mês específico
export const filtrarRegistrosPorMes = (registros, ano, mes) => {
  return registros.filter(registro => {
    const dataRegistro = new Date(registro.data + 'T00:00:00');
    return dataRegistro.getFullYear() === ano && dataRegistro.getMonth() === mes - 1;
  });
};

// Obter mês e ano atual
export const obterMesAnoAtual = () => {
  const agora = new Date();
  return {
    ano: agora.getFullYear(),
    mes: agora.getMonth() + 1, // getMonth() retorna 0-11, então somamos 1
    nomeDoMes: agora.toLocaleDateString('pt-BR', { month: 'long' })
  };
};

// Buscar registros do mês atual
export const buscarRegistrosMesAtual = async () => {
  try {
    const todosRegistros = await buscarRegistros();
    const { ano, mes } = obterMesAnoAtual();
    return filtrarRegistrosPorMes(todosRegistros, ano, mes);
  } catch (error) {
    console.error('Erro ao buscar registros do mês atual:', error);
    return [];
  }
};

