import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  ArrowLeft, 
  BarChart3, 
  Route, 
  DollarSign, 
  Fuel, 
  TrendingUp, 
  Calendar,
  Battery,
  Settings
} from 'lucide-react';
import { buscarRegistros } from '../lib/database.js';
import { calcularEstatisticasGerais, formatarMoeda, calcularCustoEletrico } from '../lib/utils.js';
import { buscarMultiplicadorEletrico, salvarMultiplicadorEletrico } from '../lib/configuracoes.js';

const RelatorioGeral = ({ onVoltar }) => {
  const [registros, setRegistros] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [multiplicadorEletrico, setMultiplicadorEletrico] = useState(0.18);
  const [novoMultiplicador, setNovoMultiplicador] = useState('');
  const [modalConfigAberto, setModalConfigAberto] = useState(false);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar registros e multiplicador em paralelo
      const [dadosRegistros, multiplicador] = await Promise.all([
        buscarRegistros(),
        buscarMultiplicadorEletrico()
      ]);
      
      setRegistros(dadosRegistros);
      setMultiplicadorEletrico(multiplicador);
      const stats = calcularEstatisticasGerais(dadosRegistros);
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarMultiplicador = async () => {
    if (!novoMultiplicador || parseFloat(novoMultiplicador) <= 0) {
      alert('Por favor, insira um valor válido para o multiplicador.');
      return;
    }

    try {
      setSalvandoConfig(true);
      const multiplicadorSalvo = await salvarMultiplicadorEletrico(novoMultiplicador);
      setMultiplicadorEletrico(multiplicadorSalvo);
      setModalConfigAberto(false);
      setNovoMultiplicador('');
      
      // Mostrar mensagem de sucesso
      alert('Multiplicador salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar multiplicador:', error);
      alert('Erro ao salvar multiplicador. Tente novamente.');
    } finally {
      setSalvandoConfig(false);
    }
  };

  const handleFecharModalConfig = () => {
    setModalConfigAberto(false);
    setNovoMultiplicador('');
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Relatório Geral</h2>
        </div>
        <div className="text-center py-8">Carregando dados...</div>
      </div>
    );
  }

  if (!estatisticas) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Relatório Geral</h2>
        </div>
        <div className="text-center py-8">Nenhum registro encontrado.</div>
      </div>
    );
  }

  const custoEletricoCalculado = calcularCustoEletrico(estatisticas.kmTotal, multiplicadorEletrico);
  const economiaEletrica = estatisticas.gastoTotalCombustivel - custoEletricoCalculado;

  const metricas = [
    {
      titulo: 'Total de Registros',
      valor: estatisticas.totalRegistros,
      icone: BarChart3,
      cor: 'text-blue-600',
      formato: 'numero'
    },
    {
      titulo: 'Km Total',
      valor: estatisticas.kmTotal,
      icone: Route,
      cor: 'text-green-600',
      formato: 'km'
    },
    {
      titulo: 'Valor Total Apurado',
      valor: estatisticas.valorTotalApurado,
      icone: DollarSign,
      cor: 'text-emerald-600',
      formato: 'moeda'
    },
    {
      titulo: 'Média Geral por Km',
      valor: estatisticas.mediaGeralPorKm,
      icone: TrendingUp,
      cor: 'text-purple-600',
      formato: 'moeda'
    },
    {
      titulo: 'Lucro Líquido Total',
      valor: estatisticas.lucroLiquidoTotal,
      icone: DollarSign,
      cor: 'text-indigo-600',
      formato: 'moeda'
    },
    {
      titulo: 'Média de Lucro Diário',
      valor: estatisticas.mediaLucroDiario,
      icone: Calendar,
      cor: 'text-orange-600',
      formato: 'moeda'
    },
    {
      titulo: 'Expectativa Salarial',
      valor: estatisticas.expectativaSalarial,
      icone: TrendingUp,
      cor: 'text-pink-600',
      formato: 'moeda'
    }
  ];

  const formatarValor = (valor, formato) => {
    switch (formato) {
      case 'moeda':
        return formatarMoeda(valor);
      case 'km':
        return `${valor} km`;
      case 'numero':
        return valor.toString();
      default:
        return valor.toString();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onVoltar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">Relatório Geral</h2>
      </div>

      {/* Grid de métricas - Layout mais compacto */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {metricas.map((metrica, index) => {
          const IconeComponent = metrica.icone;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {metrica.titulo}
                    </p>
                    <p className={`text-lg font-bold ${metrica.cor}`}>
                      {formatarValor(metrica.valor, metrica.formato)}
                    </p>
                  </div>
                  <IconeComponent className={`h-6 w-6 ${metrica.cor} ml-2`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Card de gasto com combustível - Layout mais compacto */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Fuel className="h-5 w-5" />
            Comparativo de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Combustível Atual */}
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <span className="text-2xl">⛽</span>
              <div>
                <p className="text-sm text-muted-foreground">Combustível Atual</p>
                <p className="text-xl font-bold text-red-600">
                  {formatarMoeda(estatisticas.gastoTotalCombustivel)}
                </p>
              </div>
            </div>

            {/* Carro Elétrico */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <span className="text-2xl">🔋</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Carro Elétrico (R$ {multiplicadorEletrico.toFixed(2)}/km)
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatarMoeda(custoEletricoCalculado)}
                    </p>
                    <p className="text-sm text-green-600">
                      Economia: {formatarMoeda(economiaEletrica)}
                    </p>
                  </div>
                  <Dialog open={modalConfigAberto} onOpenChange={setModalConfigAberto}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Configurar Multiplicador Elétrico</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="novoMultiplicador">Novo Multiplicador (R$ por km)</Label>
                          <Input
                            id="novoMultiplicador"
                            type="number"
                            step="0.01"
                            placeholder={multiplicadorEletrico.toFixed(2)}
                            value={novoMultiplicador}
                            onChange={(e) => setNovoMultiplicador(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Multiplicador atual: R$ {multiplicadorEletrico.toFixed(2)}/km
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSalvarMultiplicador} 
                            className="flex-1"
                            disabled={salvandoConfig}
                          >
                            {salvandoConfig ? 'Salvando...' : 'Salvar'}
                          </Button>
                          <Button variant="outline" onClick={handleFecharModalConfig}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatorioGeral;

