import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  ArrowLeft, 
  Edit, 
  X, 
  DollarSign, 
  Route, 
  Fuel,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { buscarRegistros, atualizarRegistro, excluirRegistro } from '../lib/database.js';
import { formatarMoeda, formatarData } from '../lib/utils.js';

const RelatorioIndividual = ({ onVoltar }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEdicao, setModalEdicao] = useState({ aberto: false, registro: null });
  const [modalExclusao, setModalExclusao] = useState({ aberto: false, registro: null });
  const [formEdicao, setFormEdicao] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dadosRegistros = await buscarRegistros();
      setRegistros(dadosRegistros);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarRegistro = (registro) => {
    setFormEdicao({
      data: registro.data,
      valorRecebido: registro.valorRecebido.toString(),
      distanciaKm: registro.distanciaKm.toString(),
      autonomiaKmL: registro.autonomiaKmL.toString(),
      valorCombustivel: registro.valorCombustivel.toString()
    });
    setModalEdicao({ aberto: true, registro });
  };

  const handleSalvarEdicao = async () => {
    try {
      const dadosAtualizados = {
        data: formEdicao.data,
        valorRecebido: parseFloat(formEdicao.valorRecebido),
        distanciaKm: parseFloat(formEdicao.distanciaKm),
        autonomiaKmL: parseFloat(formEdicao.autonomiaKmL),
        valorCombustivel: parseFloat(formEdicao.valorCombustivel)
      };

      await atualizarRegistro(modalEdicao.registro.id, dadosAtualizados);
      setModalEdicao({ aberto: false, registro: null });
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
    }
  };

  const handleExcluirRegistro = (registro) => {
    setModalExclusao({ aberto: true, registro });
  };

  const handleConfirmarExclusao = async () => {
    try {
      await excluirRegistro(modalExclusao.registro.id);
      setModalExclusao({ aberto: false, registro: null });
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
    }
  };

  const handleChangeFormEdicao = (e) => {
    const { name, value } = e.target;
    setFormEdicao(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Relatório Individual</h2>
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
        <h2 className="text-2xl font-bold">Relatório Individual</h2>
      </div>

      {registros.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {registros.map((registro) => (
            <Card key={registro.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatarData(registro.data)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditarRegistro(registro)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExcluirRegistro(registro)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Recebido</p>
                      <p className="font-semibold">{formatarMoeda(registro.valorRecebido)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distância</p>
                      <p className="font-semibold">{registro.distanciaKm} km</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Custo Combustível</p>
                      <p className="font-semibold">{formatarMoeda(registro.custoGasolina)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lucro</p>
                      <p className="font-semibold text-green-600">{formatarMoeda(registro.lucro)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="text-sm font-medium mb-2">Detalhes da Autonomia</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Autonomia</p>
                      <p>{registro.autonomiaKmL} km/L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Combustível</p>
                      <p>{formatarMoeda(registro.valorCombustivel)}/L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Média por km</p>
                      <p>{formatarMoeda(registro.valorRecebido / registro.distanciaKm)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Edição */}
      <Dialog open={modalEdicao.aberto} onOpenChange={(aberto) => setModalEdicao({ aberto, registro: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formEdicao.data || ''}
                onChange={handleChangeFormEdicao}
              />
            </div>
            <div>
              <Label htmlFor="valorRecebido">Valor Recebido (R$)</Label>
              <Input
                id="valorRecebido"
                name="valorRecebido"
                type="number"
                step="0.01"
                value={formEdicao.valorRecebido || ''}
                onChange={handleChangeFormEdicao}
              />
            </div>
            <div>
              <Label htmlFor="distanciaKm">Distância (km)</Label>
              <Input
                id="distanciaKm"
                name="distanciaKm"
                type="number"
                step="0.1"
                value={formEdicao.distanciaKm || ''}
                onChange={handleChangeFormEdicao}
              />
            </div>
            <div>
              <Label htmlFor="autonomiaKmL">Autonomia (km/L)</Label>
              <Input
                id="autonomiaKmL"
                name="autonomiaKmL"
                type="number"
                step="0.1"
                value={formEdicao.autonomiaKmL || ''}
                onChange={handleChangeFormEdicao}
              />
            </div>
            <div>
              <Label htmlFor="valorCombustivel">Valor Combustível (R$/L)</Label>
              <Input
                id="valorCombustivel"
                name="valorCombustivel"
                type="number"
                step="0.01"
                value={formEdicao.valorCombustivel || ''}
                onChange={handleChangeFormEdicao}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSalvarEdicao} className="flex-1">
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setModalEdicao({ aberto: false, registro: null })}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={modalExclusao.aberto} onOpenChange={(aberto) => setModalExclusao({ aberto, registro: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja excluir o registro do dia {modalExclusao.registro && formatarData(modalExclusao.registro.data)}?</p>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleConfirmarExclusao}
                className="flex-1"
              >
                Excluir
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setModalExclusao({ aberto: false, registro: null })}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatorioIndividual;

