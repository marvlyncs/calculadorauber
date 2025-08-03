import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  BarChart3, 
  Route, 
  DollarSign, 
  Fuel, 
  TrendingUp, 
  Calendar,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { calcularEstatisticasGerais, formatarMoeda, calcularCustoEletrico } from '../lib/utils.js';
import { buscarMultiplicadorEletrico, salvarMultiplicadorEletrico } from '../lib/configuracoes.js';
import { buscarRegistrosMesAtual, obterMesAnoAtual } from '../lib/filtrosMes.js';

const RelatorioGeralCompacto = forwardRef((props, ref) => {
  const [registros, setRegistros] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [multiplicadorEletrico, setMultiplicadorEletrico] = useState(0.18);
  const [novoMultiplicador, setNovoMultiplicador] = useState('');
  const [modalConfigAberto, setModalConfigAberto] = useState(false);
  const [salvandoConfig, setSalvandoConfig] = useState(false);
  const [mesAtual, setMesAtual] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Obter informações do mês atual
      const { nomeDoMes } = obterMesAnoAtual();
      setMesAtual(nomeDoMes);
      
      // Carregar registros do mês atual e multiplicador em paralelo
      const [dadosRegistros, multiplicador] = await Promise.all([
        buscarRegistrosMesAtual(),
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

  useEffect(() => {
    carregarDados();
  }, []);

  // Expor a função carregarDados para o componente pai
  useImperativeHandle(ref, () => ({
    carregarDados
  }));

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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">📊 Relatório Mensal - {mesAtual || 'Carregando...'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Carregando dados...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!estatisticas || estatisticas.totalRegistros === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">📊 Relatório Mensal - {mesAtual}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Nenhum registro encontrado para {mesAtual}. Adicione seu primeiro registro do mês acima!
          </div>
        </CardContent>
      </Card>
    );
  }

  const custoEletricoCalculado = calcularCustoEletrico(estatisticas.kmTotal, multiplicadorEletrico);
  const economiaEletrica = estatisticas.gastoTotalCombustivel - custoEletricoCalculado;

  const metricas = [
    {
      titulo: 'Registros',
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
      titulo: 'Valor Apurado',
      valor: estatisticas.valorTotalApurado,
      icone: DollarSign,
      cor: 'text-emerald-600',
      formato: 'moeda'
    },
    {
      titulo: 'Lucro Líquido',
      valor: estatisticas.lucroLiquidoTotal,
      icone: DollarSign,
      cor: 'text-indigo-600',
      formato: 'moeda'
    },
    {
      titulo: 'Média Diária',
      valor: estatisticas.mediaLucroDiario,
      icone: Calendar,
      cor: 'text-orange-600',
      formato: 'moeda'
    },
    {
      titulo: 'Expectativa Mensal',
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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          📊 Relatório Mensal - {mesAtual}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid de métricas principais */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metricas.map((metrica, index) => {
            const IconeComponent = metrica.icone;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {metrica.titulo}
                    </p>
                    <p className={`text-sm font-bold ${metrica.cor}`}>
                      {formatarValor(metrica.valor, metrica.formato)}
                    </p>
                  </div>
                  <IconeComponent className={`h-4 w-4 ${metrica.cor} ml-2`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparativo de custos */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Comparativo de Custos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Combustível Atual */}
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <span className="text-lg">⛽</span>
              <div>
                <p className="text-xs text-muted-foreground">Combustível</p>
                <p className="text-sm font-bold text-red-600">
                  {formatarMoeda(estatisticas.gastoTotalCombustivel)}
                </p>
              </div>
            </div>

            {/* Carro Elétrico */}
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <span className="text-lg">🔋</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Elétrico (R$ {multiplicadorEletrico.toFixed(2)}/km)
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      {formatarMoeda(custoEletricoCalculado)}
                    </p>
                    <p className="text-xs text-green-600">
                      Economia: {formatarMoeda(economiaEletrica)}
                    </p>
                  </div>
                  <Dialog open={modalConfigAberto} onOpenChange={setModalConfigAberto}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
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
        </div>
      </CardContent>
    </Card>
  );
});

RelatorioGeralCompacto.displayName = 'RelatorioGeralCompacto';

export default RelatorioGeralCompacto;

