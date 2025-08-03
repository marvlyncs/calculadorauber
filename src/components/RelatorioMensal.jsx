import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  BarChart3, 
  Route, 
  DollarSign, 
  Fuel, 
  TrendingUp, 
  Calendar
} from 'lucide-react';
import { buscarRegistrosPorMes } from '../lib/database.js';
import { 
  calcularEstatisticasGerais, 
  agruparPorSemana, 
  calcularEstatisticasSemana,
  formatarMoeda, 
  formatarDataCurta,
  obterNomeMes,
  obterIntervaloSemana
} from '../lib/utils.js';

const RelatorioMensal = ({ onVoltar }) => {
  const [registros, setRegistros] = useState([]);
  const [estatisticasMes, setEstatisticasMes] = useState(null);
  const [semanas, setSemanas] = useState({});
  const [loading, setLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [semanasAbertas, setSemanasAbertas] = useState({});

  useEffect(() => {
    carregarDados();
  }, [anoSelecionado, mesSelecionado]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dadosRegistros = await buscarRegistrosPorMes(anoSelecionado, mesSelecionado);
      setRegistros(dadosRegistros);
      
      const stats = calcularEstatisticasGerais(dadosRegistros);
      setEstatisticasMes(stats);
      
      const semanasDados = agruparPorSemana(dadosRegistros, anoSelecionado, mesSelecionado);
      setSemanas(semanasDados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSemana = (numeroSemana) => {
    setSemanasAbertas(prev => ({
      ...prev,
      [numeroSemana]: !prev[numeroSemana]
    }));
  };

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const meses = Array.from({ length: 12 }, (_, i) => ({ numero: i + 1, nome: obterNomeMes(i + 1) }));

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Relatório Mensal</h2>
        </div>
        <div className="text-center py-8">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onVoltar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">Relatório Mensal</h2>
      </div>

      {/* Seletores de Ano e Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={anoSelecionado.toString()} onValueChange={(valor) => setAnoSelecionado(parseInt(valor))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {anos.map(ano => (
                    <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={mesSelecionado.toString()} onValueChange={(valor) => setMesSelecionado(parseInt(valor))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {meses.map(mes => (
                    <SelectItem key={mes.numero} value={mes.numero.toString()}>{mes.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!estatisticasMes || registros.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum registro encontrado para {obterNomeMes(mesSelecionado)} de {anoSelecionado}.
          </p>
        </div>
      ) : (
        <>
          {/* Resumo do Mês */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resumo de {obterNomeMes(mesSelecionado)} {anoSelecionado}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total de Registros</p>
                  <p className="text-2xl font-bold text-blue-600">{estatisticasMes.totalRegistros}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Km Total</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticasMes.kmTotal} km</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Apurado Total</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatarMoeda(estatisticasMes.valorTotalApurado)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Gasto Combustível</p>
                  <p className="text-2xl font-bold text-red-600">{formatarMoeda(estatisticasMes.gastoTotalCombustivel)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Média por Km</p>
                  <p className="text-2xl font-bold text-purple-600">{formatarMoeda(estatisticasMes.mediaGeralPorKm)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Lucro Líquido Total</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatarMoeda(estatisticasMes.lucroLiquidoTotal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Média Lucro Dia</p>
                  <p className="text-2xl font-bold text-orange-600">{formatarMoeda(estatisticasMes.mediaLucroDiario)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Expectativa Salarial</p>
                  <p className="text-2xl font-bold text-pink-600">{formatarMoeda(estatisticasMes.expectativaSalarial)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relatório por Semanas */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Relatório por Semanas</h3>
            
            {Object.keys(semanas).sort().map(numeroSemana => {
              const registrosSemana = semanas[numeroSemana];
              const estatisticasSemana = calcularEstatisticasSemana(registrosSemana);
              const intervaloSemana = obterIntervaloSemana(parseInt(numeroSemana), anoSelecionado, mesSelecionado);
              const semanaAberta = semanasAbertas[numeroSemana];

              return (
                <Card key={numeroSemana}>
                  <Collapsible open={semanaAberta} onOpenChange={() => toggleSemana(numeroSemana)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Semana {numeroSemana} - {intervaloSemana}
                          </CardTitle>
                          {semanaAberta ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Registros</p>
                            <p className="font-semibold">{estatisticasSemana.totalRegistros}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Km Total</p>
                            <p className="font-semibold">{estatisticasSemana.kmTotal}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Valor Apurado</p>
                            <p className="font-semibold">{formatarMoeda(estatisticasSemana.valorApurado)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Gasto Combustível</p>
                            <p className="font-semibold">{formatarMoeda(estatisticasSemana.gastoCombustivel)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Média/Km</p>
                            <p className="font-semibold">{formatarMoeda(estatisticasSemana.mediaPorKm)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Lucro Líquido</p>
                            <p className="font-semibold">{formatarMoeda(estatisticasSemana.lucroLiquido)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Lucro/Dia</p>
                            <p className="font-semibold">{formatarMoeda(estatisticasSemana.lucroLiquidoDiario)}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground mb-3">Registros da Semana:</h4>
                          {registrosSemana.map(registro => (
                            <div key={registro.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="font-medium">{formatarDataCurta(registro.data)}</p>
                                  <p className="text-sm text-muted-foreground">{registro.distanciaKm} km</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="text-right">
                                  <p className="text-muted-foreground">Recebido</p>
                                  <p className="font-medium">{formatarMoeda(registro.valorRecebido)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-muted-foreground">Combustível</p>
                                  <p className="font-medium">{formatarMoeda(registro.custoGasolina)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-muted-foreground">Lucro</p>
                                  <p className="font-medium text-green-600">{formatarMoeda(registro.lucro)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RelatorioMensal;

