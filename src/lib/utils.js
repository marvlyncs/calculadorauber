// Utilitários para cálculos e formatação
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função utilitária para combinar classes CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatar valor monetário
export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Formatar data para exibição
export const formatarData = (data) => {
  // Adicionar 'T00:00:00' para garantir que seja interpretado como horário local
  const dataObj = new Date(data + 'T00:00:00');
  return dataObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Formatar data curta
export const formatarDataCurta = (data) => {
  // Adicionar 'T00:00:00' para garantir que seja interpretado como horário local
  const dataObj = new Date(data + 'T00:00:00');
  return dataObj.toLocaleDateString('pt-BR');
};

// Calcular estatísticas gerais
export const calcularEstatisticasGerais = (registros) => {
  if (!registros || registros.length === 0) {
    return {
      totalRegistros: 0,
      kmTotal: 0,
      valorTotalApurado: 0,
      gastoTotalCombustivel: 0,
      mediaGeralPorKm: 0,
      lucroLiquidoTotal: 0,
      mediaLucroDiario: 0,
      expectativaSalarial: 0
    };
  }

  const totalRegistros = registros.length;
  const kmTotal = registros.reduce((acc, reg) => acc + reg.distanciaKm, 0);
  const valorTotalApurado = registros.reduce((acc, reg) => acc + reg.valorRecebido, 0);
  const gastoTotalCombustivel = registros.reduce((acc, reg) => acc + reg.custoGasolina, 0);
  const lucroLiquidoTotal = registros.reduce((acc, reg) => acc + reg.lucro, 0);
  
  const mediaGeralPorKm = kmTotal > 0 ? valorTotalApurado / kmTotal : 0;
  const mediaLucroDiario = totalRegistros > 0 ? lucroLiquidoTotal / totalRegistros : 0;
  
  // Expectativa salarial baseada no mês atual
  const agora = new Date();
  const diasNoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getDate();
  const expectativaSalarial = mediaLucroDiario * diasNoMes;

  return {
    totalRegistros,
    kmTotal: parseFloat(kmTotal.toFixed(2)),
    valorTotalApurado: parseFloat(valorTotalApurado.toFixed(2)),
    gastoTotalCombustivel: parseFloat(gastoTotalCombustivel.toFixed(2)),
    mediaGeralPorKm: parseFloat(mediaGeralPorKm.toFixed(2)),
    lucroLiquidoTotal: parseFloat(lucroLiquidoTotal.toFixed(2)),
    mediaLucroDiario: parseFloat(mediaLucroDiario.toFixed(2)),
    expectativaSalarial: parseFloat(expectativaSalarial.toFixed(2))
  };
};

// Calcular custo com carro elétrico
export const calcularCustoEletrico = (kmTotal, multiplicador) => {
  return parseFloat((kmTotal * multiplicador).toFixed(2));
};

// Agrupar registros por semana
export const agruparPorSemana = (registros, ano, mes) => {
  const semanas = {};
  
  registros.forEach(registro => {
    // Adicionar 'T00:00:00' para garantir que seja interpretado como horário local
    const data = new Date(registro.data + 'T00:00:00');
    if (data.getFullYear() === ano && data.getMonth() === mes - 1) {
      const dia = data.getDate();
      let semana;
      
      if (dia <= 7) semana = 1;
      else if (dia <= 14) semana = 2;
      else if (dia <= 21) semana = 3;
      else semana = 4;
      
      if (!semanas[semana]) {
        semanas[semana] = [];
      }
      semanas[semana].push(registro);
    }
  });
  
  return semanas;
};

// Calcular estatísticas de uma semana
export const calcularEstatisticasSemana = (registrosSemana) => {
  if (!registrosSemana || registrosSemana.length === 0) {
    return {
      totalRegistros: 0,
      kmTotal: 0,
      valorApurado: 0,
      gastoCombustivel: 0,
      mediaPorKm: 0,
      lucroLiquido: 0,
      lucroLiquidoDiario: 0
    };
  }

  const totalRegistros = registrosSemana.length;
  const kmTotal = registrosSemana.reduce((acc, reg) => acc + reg.distanciaKm, 0);
  const valorApurado = registrosSemana.reduce((acc, reg) => acc + reg.valorRecebido, 0);
  const gastoCombustivel = registrosSemana.reduce((acc, reg) => acc + reg.custoGasolina, 0);
  const lucroLiquido = registrosSemana.reduce((acc, reg) => acc + reg.lucro, 0);
  
  const mediaPorKm = kmTotal > 0 ? valorApurado / kmTotal : 0;
  const lucroLiquidoDiario = totalRegistros > 0 ? lucroLiquido / totalRegistros : 0;

  return {
    totalRegistros,
    kmTotal: parseFloat(kmTotal.toFixed(2)),
    valorApurado: parseFloat(valorApurado.toFixed(2)),
    gastoCombustivel: parseFloat(gastoCombustivel.toFixed(2)),
    mediaPorKm: parseFloat(mediaPorKm.toFixed(2)),
    lucroLiquido: parseFloat(lucroLiquido.toFixed(2)),
    lucroLiquidoDiario: parseFloat(lucroLiquidoDiario.toFixed(2))
  };
};

// Obter nome do mês
export const obterNomeMes = (mes) => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes - 1];
};

// Obter intervalo de datas da semana
export const obterIntervaloSemana = (semana, ano, mes) => {
  const inicioSemana = (semana - 1) * 7 + 1;
  const fimSemana = Math.min(semana * 7, new Date(ano, mes, 0).getDate());
  return `${inicioSemana}-${fimSemana} de ${obterNomeMes(mes)}`;
};

