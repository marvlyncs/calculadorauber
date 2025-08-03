import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { CalendarDays, DollarSign, Route, Fuel, Calculator } from 'lucide-react';
import { salvarRegistro } from '../lib/database.js';

const FormularioEntrada = ({ onSalvarSucesso, onVerRelatorio }) => {
  const [formData, setFormData] = useState({
    data: '',
    valorRecebido: '',
    distanciaKm: '',
    autonomiaKmL: '',
    valorCombustivel: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErro('');
  };

  const validarFormulario = () => {
    if (!formData.data) return 'Data é obrigatória';
    if (!formData.valorRecebido || parseFloat(formData.valorRecebido) <= 0) return 'Valor recebido deve ser maior que zero';
    if (!formData.distanciaKm || parseFloat(formData.distanciaKm) <= 0) return 'Distância deve ser maior que zero';
    if (!formData.autonomiaKmL || parseFloat(formData.autonomiaKmL) <= 0) return 'Autonomia deve ser maior que zero';
    if (!formData.valorCombustivel || parseFloat(formData.valorCombustivel) <= 0) return 'Valor do combustível deve ser maior que zero';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setLoading(true);
    try {
      const registro = {
        data: formData.data,
        valorRecebido: parseFloat(formData.valorRecebido),
        distanciaKm: parseFloat(formData.distanciaKm),
        autonomiaKmL: parseFloat(formData.autonomiaKmL),
        valorCombustivel: parseFloat(formData.valorCombustivel)
      };

      await salvarRegistro(registro);
      
      // Limpar formulário
      setFormData({
        data: '',
        valorRecebido: '',
        distanciaKm: '',
        autonomiaKmL: '',
        valorCombustivel: ''
      });
      
      onSalvarSucesso && onSalvarSucesso();
    } catch (error) {
      setErro('Erro ao salvar registro. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6" />
          Calculadora de Ganhos Uber
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data do dia trabalhado */}
          <div className="space-y-2">
            <Label htmlFor="data" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Data do dia trabalhado
            </Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          {/* Valor recebido */}
          <div className="space-y-2">
            <Label htmlFor="valorRecebido" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor recebido (R$)
            </Label>
            <Input
              id="valorRecebido"
              name="valorRecebido"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.valorRecebido}
              onChange={handleChange}
              required
            />
          </div>

          {/* Distância percorrida */}
          <div className="space-y-2">
            <Label htmlFor="distanciaKm" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Distância percorrida (km)
            </Label>
            <Input
              id="distanciaKm"
              name="distanciaKm"
              type="number"
              step="0.1"
              min="0"
              placeholder="0,0"
              value={formData.distanciaKm}
              onChange={handleChange}
              required
            />
          </div>

          {/* Autonomia do carro */}
          <div className="space-y-2">
            <Label htmlFor="autonomiaKmL" className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Autonomia do carro (km/L)
            </Label>
            <Input
              id="autonomiaKmL"
              name="autonomiaKmL"
              type="number"
              step="0.1"
              min="0"
              placeholder="0,0"
              value={formData.autonomiaKmL}
              onChange={handleChange}
              required
            />
          </div>

          {/* Valor do combustível */}
          <div className="space-y-2">
            <Label htmlFor="valorCombustivel" className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Valor do combustível (R$/L)
            </Label>
            <Input
              id="valorCombustivel"
              name="valorCombustivel"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.valorCombustivel}
              onChange={handleChange}
              required
            />
          </div>

          {erro && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {erro}
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Calcular e Salvar'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onVerRelatorio}
            >
              Ver Relatório
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioEntrada;

