import { database } from './firebase.js';
import { ref, set, get } from 'firebase/database';

// Configurações do aplicativo
const CONFIG_REF = 'configuracoes';

// Salvar multiplicador do carro elétrico
export const salvarMultiplicadorEletrico = async (multiplicador) => {
  try {
    const configRef = ref(database, `${CONFIG_REF}/multiplicadorEletrico`);
    await set(configRef, parseFloat(multiplicador));
    return parseFloat(multiplicador);
  } catch (error) {
    console.error('Erro ao salvar multiplicador elétrico:', error);
    throw error;
  }
};

// Buscar multiplicador do carro elétrico
export const buscarMultiplicadorEletrico = async () => {
  try {
    const configRef = ref(database, `${CONFIG_REF}/multiplicadorEletrico`);
    const snapshot = await get(configRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    
    // Valor padrão se não existir
    return 0.18;
  } catch (error) {
    console.error('Erro ao buscar multiplicador elétrico:', error);
    // Retorna valor padrão em caso de erro
    return 0.18;
  }
};

