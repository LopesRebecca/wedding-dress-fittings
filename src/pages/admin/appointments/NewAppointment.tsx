// ==========================================
// Novo Agendamento Admin (Wizard)
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar,
  Clock,
  User,
  Palette,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { LoadingSpinner } from '@/components/atoms';
import { appointmentService, customerService } from '@/services/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/hooks/use-toast';
import { DressCategory, DressCategoryLabels, type Customer } from '@/types/admin';

type Step = 1 | 2 | 3 | 4;

const steps = [
  { number: 1, title: 'Data', icon: Calendar },
  { number: 2, title: 'Horário', icon: Clock },
  { number: 3, title: 'Cliente', icon: User },
  { number: 4, title: 'Detalhes', icon: Palette },
];

export function NewAppointment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Data
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Step 2: Horário
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState('');

  // Step 3: Cliente
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [createUserAccount, setCreateUserAccount] = useState(false);

  // Step 4: Detalhes
  const [colorDress, setColorDress] = useState('');
  const [dressCategory, setDressCategory] = useState<DressCategory>(DressCategory.Noiva);
  const [willBringCompanion, setWillBringCompanion] = useState(false);
  const [companionCount, setCompanionCount] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadTimeSlots = useCallback(async () => {
    if (!selectedDate) return;
    
    setIsLoadingSlots(true);
    setUnavailableReason('');
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const result = await appointmentService.getAvailableTimeSlots(dateStr);
      
      if (!result.isAvailable) {
        setTimeSlots([]);
        setUnavailableReason(result.reason || 'Data indisponível');
      } else {
        setTimeSlots(result.timeSlots);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedDate]);

  const searchCustomers = useCallback(async () => {
    if (!debouncedSearch) return;
    setIsSearching(true);
    try {
      const results = await customerService.search(debouncedSearch);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearch]);

  // Buscar horários quando data é selecionada
  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate, loadTimeSlots]);

  // Buscar clientes
  useEffect(() => {
    if (debouncedSearch) {
      searchCustomers();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, searchCustomers]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!selectedDate;
      case 2:
        return !!selectedTime;
      case 3:
        return isNewCustomer 
          ? !!customerName && !!customerPhone
          : !!selectedCustomer;
      case 4:
        return !!colorDress;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);
    try {
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await appointmentService.create({
        scheduledAt: scheduledAt.toISOString(),
        customerName: isNewCustomer ? customerName : selectedCustomer!.name,
        customerPhone: isNewCustomer 
          ? customerPhone.replace(/\D/g, '') 
          : selectedCustomer!.phone,
        createUserAccount,
        colorDress,
        dressCategory,
        willBringCompanion,
        companionCount: willBringCompanion ? companionCount : 0,
      });

      toast({
        title: 'Agendamento criado! ✅',
        description: 'O agendamento foi salvo com sucesso.',
      });

      navigate('/admin/appointments');
    } catch (error: unknown) {
      toast({
        title: 'Erro ao criar agendamento',
        description: (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-2xl font-display font-medium text-gray-900">
          Novo Agendamento
        </h1>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center gap-2 ${
              currentStep >= step.number ? 'text-primary' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep > step.number 
                  ? 'bg-primary text-white'
                  : currentStep === step.number 
                    ? 'bg-primary/10 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className="hidden sm:block font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-2xl border border-gray-100 p-8"
      >
        {/* Step 1: Data */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Selecione a Data
            </h2>
            <div className="flex justify-center">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                locale={ptBR}
                className="rounded-xl border"
              />
            </div>
            {selectedDate && (
              <p className="text-center text-gray-600 mt-4">
                Data selecionada: <strong>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>
              </p>
            )}
          </div>
        )}

        {/* Step 2: Horário */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Selecione o Horário
            </h2>
            <p className="text-gray-500 mb-6">
              {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>

            {isLoadingSlots ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : unavailableReason ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{unavailableReason}</p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="mt-4"
                >
                  Escolher outra data
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                      selectedTime === time
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Cliente */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Dados do Cliente
            </h2>

            {/* Toggle: Buscar ou Novo */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setIsNewCustomer(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                  !isNewCustomer ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Buscar Cliente
              </button>
              <button
                onClick={() => setIsNewCustomer(true)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                  isNewCustomer ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Novo Cliente
              </button>
            </div>

            {!isNewCustomer ? (
              <div>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-xl"
                  />
                </div>

                {/* Results */}
                {isSearching ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchResults.map((customer) => (
                      <button
                        key={customer.customerId}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition ${
                          selectedCustomer?.customerId === customer.customerId
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </button>
                    ))}
                  </div>
                ) : searchTerm && !isSearching ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum cliente encontrado
                  </p>
                ) : null}

                {selectedCustomer && (
                  <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-green-800 font-medium">
                      Cliente selecionado: {selectedCustomer.name}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    placeholder="Maria Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone (WhatsApp) *
                  </label>
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                    maxLength={15}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="createAccount"
                    checked={createUserAccount}
                    onCheckedChange={(checked) => setCreateUserAccount(checked as boolean)}
                  />
                  <label htmlFor="createAccount" className="text-sm text-gray-700 cursor-pointer">
                    Criar conta de acesso para este cliente
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Detalhes */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Detalhes da Prova
            </h2>

            {/* Cor do Vestido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Vestido *
              </label>
              <Input
                type="text"
                placeholder="Branco, Off-White, Champagne..."
                value={colorDress}
                onChange={(e) => setColorDress(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria do Vestido
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(DressCategoryLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setDressCategory(Number(value) as DressCategory)}
                    className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                      dressCategory === Number(value)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Acompanhantes */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="companion"
                  checked={willBringCompanion}
                  onCheckedChange={(checked) => setWillBringCompanion(checked as boolean)}
                />
                <label htmlFor="companion" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Cliente trará acompanhantes
                </label>
              </div>

              {willBringCompanion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de acompanhantes
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={companionCount}
                    onChange={(e) => setCompanionCount(parseInt(e.target.value) || 0)}
                    className="h-12 rounded-xl w-32"
                  />
                </motion.div>
              )}
            </div>

            {/* Resumo */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Resumo do Agendamento</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Data:</span> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</p>
                <p><span className="text-gray-500">Horário:</span> {selectedTime}</p>
                <p><span className="text-gray-500">Cliente:</span> {isNewCustomer ? customerName : selectedCustomer?.name}</p>
                <p><span className="text-gray-500">Vestido:</span> {DressCategoryLabels[dressCategory]} - {colorDress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="rounded-xl"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className="rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Confirmar Agendamento
                </span>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default NewAppointment;
