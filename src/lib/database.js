import { database } from './firebase.js';
import { ref, push, set, get, remove, update } from 'firebase/database';

// Estrutura de dados para um registro:
// {
//   id: string,
//   data: string (YYYY-MM-DD),
//   valorRecebido: number,
//   distanciaKm: number,
//   autonomiaKmL: number,
//   valorCombustivel: number,
//   custoGasolina: number (calculado),
//   lucro: number (calculado),
//   timestamp: number
// }

// Salvar um novo registro
export const salvarRegistro = async (registro) => {
  try {
    const registrosRef = ref(database, 'registros');
    const novoRegistroRef = push(registrosRef);
    
    // Calcular valores derivados
    const custoGasolina = (registro.distanciaKm / registro.autonomiaKmL) * registro.valorCombustivel;
    const lucro = registro.valorRecebido - custoGasolina;
    
    const registroCompleto = {
      ...registro,
      id: novoRegistroRef.key,
      custoGasolina: parseFloat(custoGasolina.toFixed(2)),
      lucro: parseFloat(lucro.toFixed(2)),
      timestamp: Date.now()
    };
    
    await set(novoRegistroRef, registroCompleto);
    return registroCompleto;
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
    throw error;
  }
};

// Buscar todos os registros
export const buscarRegistros = async () => {
  try {
    const registrosRef = ref(database, 'registros');
    const snapshot = await get(registrosRef);
    
    if (snapshot.exists()) {
      const dados = snapshot.val();
      return Object.values(dados).sort((a, b) => new Date(b.data) - new Date(a.data));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    throw error;
  }
};

// Atualizar um registro existente
export const atualizarRegistro = async (id, dadosAtualizados) => {
  try {
    const registroRef = ref(database, `registros/${id}`);
    
    // Recalcular valores derivados
    const custoGasolina = (dadosAtualizados.distanciaKm / dadosAtualizados.autonomiaKmL) * dadosAtualizados.valorCombustivel;
    const lucro = dadosAtualizados.valorRecebido - custoGasolina;
    
    const registroAtualizado = {
      ...dadosAtualizados,
      custoGasolina: parseFloat(custoGasolina.toFixed(2)),
      lucro: parseFloat(lucro.toFixed(2)),
      timestamp: Date.now()
    };
    
    await update(registroRef, registroAtualizado);
    return registroAtualizado;
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    throw error;
  }
};

// Excluir um registro
export const excluirRegistro = async (id) => {
  try {
    const registroRef = ref(database, `registros/${id}`);
    await remove(registroRef);
  } catch (error) {
    console.error('Erro ao excluir registro:', error);
    throw error;
  }
};

// Buscar registros por mês
export const buscarRegistrosPorMes = async (ano, mes) => {
  try {
    const registros = await buscarRegistros();
    return registros.filter(registro => {
      // Adicionar 'T00:00:00' para garantir que seja interpretado como horário local
      const dataRegistro = new Date(registro.data + 'T00:00:00');
      return dataRegistro.getFullYear() === ano && dataRegistro.getMonth() === mes - 1;
    });
  } catch (error) {
    console.error('Erro ao buscar registros por mês:', error);
    throw error;
  }
};

