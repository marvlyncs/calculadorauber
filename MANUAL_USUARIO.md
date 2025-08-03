# Calculadora de Ganhos Uber - Manual do Usuário

## 🚗 Sobre a Aplicação

A Calculadora de Ganhos Uber é um aplicativo web completo desenvolvido para ajudar motoristas de Uber a calcular e acompanhar seus ganhos de forma detalhada. A aplicação oferece funcionalidades avançadas de relatórios e integração com Firebase para armazenamento seguro em nuvem.

## 🌐 Acesso à Aplicação

**URL da Aplicação:** https://qbtbqrjo.manus.space

## ✨ Funcionalidades Principais

### 1. Formulário de Entrada
- **Data do dia trabalhado**: Selecione a data em que trabalhou
- **Valor recebido**: Insira o valor total recebido no dia (R$)
- **Distância percorrida**: Quilometragem total rodada (km)
- **Autonomia do carro**: Consumo do veículo (km/L)
- **Valor do combustível**: Preço do combustível por litro (R$/L)

### 2. Cálculos Automáticos
A aplicação calcula automaticamente:
- Custo total com combustível
- Lucro líquido (valor recebido - custo combustível)
- Média de ganho por quilômetro

### 3. Tipos de Relatórios

#### 📊 Relatório Geral
Apresenta uma visão completa de todos os registros com:
- Total de registros
- Quilometragem total
- Valor total apurado
- Gasto total com combustível
- Média geral por km
- Lucro líquido total
- Média de lucro diário
- Expectativa salarial mensal

**Funcionalidade Especial - Carro Elétrico:**
- Ícone 🔋 permite calcular custos alternativos com carro elétrico
- Insira um multiplicador (ex: 0,18) para calcular o custo por km com eletricidade
- Compare a economia potencial

#### 📅 Relatório Mensal
Análise detalhada dividida por semanas:
- Seleção de ano e mês
- Resumo mensal completo
- Divisão por semanas (1-7, 8-14, 15-21, 22-31)
- Cada semana é expansível/recolhível
- Estatísticas detalhadas por semana
- Registros individuais dentro de cada semana

#### 📝 Relatório Individual
Detalhes de cada dia trabalhado:
- Lista todos os registros ordenados por data
- Informações completas de cada dia
- **Edição**: Ícone ✏️ para modificar registros
- **Exclusão**: Ícone ❌ para remover registros
- Detalhes da autonomia e cálculos

## 🔧 Como Usar

### Adicionando um Novo Registro
1. Acesse a tela principal
2. Preencha todos os 5 campos obrigatórios
3. Clique em "Calcular e Salvar"
4. Aguarde a confirmação de sucesso

### Visualizando Relatórios
1. Clique em "Ver Relatório"
2. Escolha o tipo de relatório desejado
3. Navegue pelos dados usando os controles disponíveis

### Editando Registros
1. Acesse o "Relatório Individual"
2. Clique no ícone ✏️ do registro desejado
3. Modifique os dados no modal
4. Clique em "Salvar"

### Excluindo Registros
1. Acesse o "Relatório Individual"
2. Clique no ícone ❌ do registro desejado
3. Confirme a exclusão

## 💾 Armazenamento de Dados

- Todos os dados são salvos automaticamente no Firebase
- Acesso em tempo real de qualquer dispositivo
- Backup automático na nuvem
- Sincronização instantânea

## 📱 Compatibilidade

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets
- ✅ Smartphones (Android, iOS)
- ✅ Todos os navegadores modernos

## 🔒 Segurança

- Dados criptografados
- Armazenamento seguro no Firebase
- Acesso via HTTPS

## 📈 Métricas Calculadas

### Automáticas
- **Custo Combustível**: (Distância ÷ Autonomia) × Valor Combustível
- **Lucro**: Valor Recebido - Custo Combustível
- **Média por Km**: Valor Recebido ÷ Distância

### Relatórios
- **Média Lucro Diário**: Lucro Total ÷ Número de Registros
- **Expectativa Salarial**: Média Lucro Diário × Dias do Mês Atual

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se todos os campos estão preenchidos corretamente
2. Certifique-se de que os valores numéricos são positivos
3. Aguarde alguns segundos para sincronização com o Firebase

## 🚀 Tecnologias Utilizadas

- **Frontend**: React + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Firebase Realtime Database
- **Deploy**: Manus Platform
- **Ícones**: Lucide React

---

**Desenvolvido com ❤️ para motoristas de Uber**

