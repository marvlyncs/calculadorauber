import React, { useState, useRef } from 'react';
import './App.css';
import FormularioEntrada from './components/FormularioEntrada.jsx';
import SeletorRelatorios from './components/SeletorRelatorios.jsx';
import RelatorioGeral from './components/RelatorioGeral.jsx';
import RelatorioMensal from './components/RelatorioMensal.jsx';
import RelatorioIndividual from './components/RelatorioIndividual.jsx';
import RelatorioGeralCompacto from './components/RelatorioGeralCompacto.jsx';

function App() {
  const [telaAtual, setTelaAtual] = useState('formulario'); // formulario, seletor, geral, mensal, individual
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const relatorioCompactoRef = useRef();

  const handleSalvarSucesso = () => {
    setMensagemSucesso('Registro salvo com sucesso!');
    setTimeout(() => setMensagemSucesso(''), 3000);
    
    // Recarregar dados do relatório compacto
    if (relatorioCompactoRef.current && relatorioCompactoRef.current.carregarDados) {
      relatorioCompactoRef.current.carregarDados();
    }
  };

  const handleVerRelatorio = () => {
    setTelaAtual('seletor');
  };

  const handleSelecionarRelatorio = (tipoRelatorio) => {
    setTelaAtual(tipoRelatorio);
  };

  const handleVoltar = () => {
    if (telaAtual === 'seletor') {
      setTelaAtual('formulario');
    } else {
      setTelaAtual('seletor');
    }
  };

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'formulario':
        return (
          <div className="space-y-6">
            <FormularioEntrada 
              onSalvarSucesso={handleSalvarSucesso}
              onVerRelatorio={handleVerRelatorio}
            />
            <RelatorioGeralCompacto ref={relatorioCompactoRef} />
          </div>
        );
      case 'seletor':
        return (
          <SeletorRelatorios 
            onSelecionarRelatorio={handleSelecionarRelatorio}
            onVoltar={handleVoltar}
          />
        );
      case 'geral':
        return <RelatorioGeral onVoltar={handleVoltar} />;
      case 'mensal':
        return <RelatorioMensal onVoltar={handleVoltar} />;
      case 'individual':
        return <RelatorioIndividual onVoltar={handleVoltar} />;
      default:
        return (
          <div className="space-y-6">
            <FormularioEntrada 
              onSalvarSucesso={handleSalvarSucesso}
              onVerRelatorio={handleVerRelatorio}
            />
            <RelatorioGeralCompacto ref={relatorioCompactoRef} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        {mensagemSucesso && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
            {mensagemSucesso}
          </div>
        )}
        
        {renderizarTela()}
      </div>
    </div>
  );
}

export default App;

