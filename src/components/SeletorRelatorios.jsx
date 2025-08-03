import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { BarChart3, Calendar, FileText, ArrowLeft } from 'lucide-react';

const SeletorRelatorios = ({ onSelecionarRelatorio, onVoltar }) => {
  const relatorios = [
    {
      id: 'geral',
      titulo: 'Relatório Geral',
      descricao: 'Visão completa de todos os registros com estatísticas gerais',
      icone: BarChart3,
      cor: 'bg-blue-500'
    },
    {
      id: 'mensal',
      titulo: 'Relatório Mensal',
      descricao: 'Análise detalhada por mês dividida em semanas',
      icone: Calendar,
      cor: 'bg-green-500'
    },
    {
      id: 'individual',
      titulo: 'Relatório Individual',
      descricao: 'Detalhes de cada dia trabalhado com opções de edição',
      icone: FileText,
      cor: 'bg-purple-500'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onVoltar}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">Selecione o Tipo de Relatório</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatorios.map((relatorio) => {
          const IconeComponent = relatorio.icone;
          return (
            <Card 
              key={relatorio.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform"
              onClick={() => onSelecionarRelatorio(relatorio.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${relatorio.cor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconeComponent className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{relatorio.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  {relatorio.descricao}
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Acessar Relatório
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SeletorRelatorios;

