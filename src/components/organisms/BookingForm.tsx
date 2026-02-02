// ==========================================
// ORGANISM: Booking Form
// Formulário completo de agendamento
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Shirt, Palette, Users, MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionTitle, LoadingSpinner } from '@/components/atoms';
import { FormField, CompanionsCheckbox, Dropdown } from '@/components/molecules';
import { ServiceSelector } from './ServiceSelector';
import { DateTimePicker } from './DateTimePicker';
import { useServices } from '@/hooks/useServices';
import { useTimeSlots } from '@/hooks/useAvailability';
import { useCreateBooking } from '@/hooks/useBooking';
import { useEstablishmentConfig } from '@/hooks/useConfig';
import { toast } from '@/hooks/use-toast';
import type { BookingFormData } from '@/types';

export function BookingForm() {
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dressType, setDressType] = useState('');
  const [otherDressType, setOtherDressType] = useState('');
  const [service, setService] = useState('');
  const [otherService, setOtherService] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [hasCompanions, setHasCompanions] = useState(false);
  const [companionsCount, setCompanionsCount] = useState('');
  const [createAccount, setCreateAccount] = useState(false);

  // API hooks
  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: config } = useEstablishmentConfig();
  const createBookingMutation = useCreateBooking();

  // Time slots - busca quando tem serviço e data selecionados
  const dateStr = date ? format(date, 'yyyy-MM-dd') : null;
  const { data: timeSlots = [], isLoading: isLoadingTimeSlots } = useTimeSlots(
    service || null,
    dateStr
  );

  // Get selected service info
  const selectedService = services.find(s => s.id === service);

  // Reset time when service or date changes
  useEffect(() => {
    setSelectedTime('');
  }, [service, date]);

  // Phone formatting
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!name || !phone || !dressType || !service || !color || !date || !selectedTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !date) return;

    const bookingData: BookingFormData = {
      name,
      phone,
      dressType,
      otherDressType: dressType,
      serviceId: service,
      color,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
      hasCompanions,
      companionsCount: hasCompanions ? parseInt(companionsCount) : undefined,
      createAccount,
    };

    try {
      // Envia para o backend
      const response = await createBookingMutation.mutateAsync(bookingData);

      // Monta mensagem para WhatsApp
      const serviceLabel = service === 'outro'
        ? otherService
        : selectedService?.label;

      const dressTypeLabel = dressType === 'outros' ? otherDressType : dressType;

      const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      const duration = selectedService?.durationMinutes
        ? selectedService.durationMinutes >= 60
          ? `${selectedService.durationMinutes / 60} hora(s)`
          : `${selectedService.durationMinutes} minutos`
        : '1 hora';

      const companionsInfo = hasCompanions && companionsCount
        ? `👥 Acompanhantes: ${companionsCount} pessoa(s)\n`
        : `👥 Acompanhantes: Irei sozinha\n`;

      const message = encodeURIComponent(
        `Olá! Gostaria de agendar uma prova de vestido.\n\n` +
        `🎫 Código: ${response.id}\n` +
        `👤 Nome: ${name}\n` +
        `📱 Telefone: ${phone}\n` +
        `👗 Tipo de vestido: ${dressTypeLabel}\n` +
        `✨ Serviço: ${serviceLabel}\n` +
        `🎨 Cor: ${color}\n` +
        companionsInfo +
        `📅 Data preferida: ${formattedDate}\n` +
        `🕐 Horário: ${selectedTime} (duração: ${duration})\n\n` +
        `Aguardo confirmação. Obrigada!`
      );

      const whatsappNumber = config?.whatsappNumber || '5521982495227';
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

      toast({
        title: 'Agendamento enviado! 🎉',
        description: 'Você será redirecionada para o WhatsApp para confirmar.',
      });

      // Reset form
      setName('');
      setPhone('');
      setDressType('');
      setOtherDressType('');
      setService('');
      setOtherService('');
      setColor('');
      setDate(undefined);
      setSelectedTime('');
      setHasCompanions(false);
      setCompanionsCount('');
      setCreateAccount(false);
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const isSubmitting = createBookingMutation.isPending;

  return (
    <section id="agendamento" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <SectionTitle
              label="Agende Sua Prova"
              title="Reserve Seu"
              highlight="Momento"
              description="Preencha o formulário abaixo e entraremos em contato pelo WhatsApp para confirmar sua prova."
            />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/50"
          >
            {/* Nome */}
            <FormField icon={<User />} label="Seu Nome" htmlFor="name">
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
              />
            </FormField>

            {/* Telefone */}
            <FormField icon={<Phone />} label="WhatsApp" htmlFor="phone" className='pr-2'>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
              />
            </FormField>

            {/* Tipo de Vestido e Cor - Mesma Linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              {/* Tipo de Vestido */}
              <div>
                <Dropdown
                  icon={<Shirt />}
                  label="Tipo de Vestido"
                  placeholder="Selecione o tipo de vestido"
                  options={[
                    { value: 'noiva', label: 'Noiva' },
                    { value: 'dama', label: 'Dama de Honra' },
                    { value: 'daminha', label: 'Daminha de Honra' },
                    { value: 'debutante', label: 'Debutante' },
                    { value: 'madrinha', label: 'Madrinha' },
                    { value: 'convidada', label: 'Convidada' },
                    { value: 'outros', label: 'Outros' },
                  ]}
                  value={dressType}
                  onChange={setDressType}
                />
              </div>

              {/* Cor do Vestido */}
              <div>
                <FormField icon={<Palette />} label="Cor do Vestido" className="mb-0">
                  <Input
                    type="text"
                    placeholder="Especifique a cor desejada..."
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
                  />
                </FormField>
              </div>
            </div>

            {/* Campo para especificar outro tipo de vestido */}
            {dressType === 'outros' && (
              <FormField icon={<Palette />} label="Especifique o Tipo de Vestido">
                <Input
                  type="text"
                  placeholder="Digite o tipo de vestido..."
                  value={otherDressType}
                  onChange={(e) => setOtherDressType(e.target.value)}
                  className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
                />
              </FormField>
            )}

            {/* Acompanhantes */}
            <FormField icon={<Users />} label="Acompanhantes">
              <CompanionsCheckbox
                hasCompanions={hasCompanions}
                onHasCompanionsChange={setHasCompanions}
                companionsCount={companionsCount}
                onCompanionsCountChange={setCompanionsCount}
                createAccount={createAccount}
                onCreateAccountChange={setCreateAccount}
              />
            </FormField>

            {/* Data e Horário */}
            <DateTimePicker
              date={date}
              onDateChange={setDate}
              time={selectedTime}
              onTimeChange={setSelectedTime}
              timeSlots={timeSlots}
              serviceDuration={selectedService?.durationMinutes}
              isLoadingTimeSlots={isLoadingTimeSlots}
              hint={
                selectedService?.id === 'noiva'
                  ? '✨ Provas para noivas têm duração de 2 horas'
                  : undefined
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg shadow-soft hover:shadow-glow transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Agendar
                </span>
              )}
            </Button>

            {/* WhatsApp Info */}
            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Você receberá atualizações pelo WhatsApp</span>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default BookingForm;
