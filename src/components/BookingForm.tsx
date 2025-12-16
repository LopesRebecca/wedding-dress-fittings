import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Phone, MessageCircle, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

const serviceOptions = [
  { id: "noiva", label: "Noiva", icon: "💍" },
  { id: "debutante", label: "Debutante", icon: "👑" },
  { id: "madrinha", label: "Madrinha", icon: "✨" },
  { id: "daminha", label: "Daminha", icon: "🌸" },
];

const BookingForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !service || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Criar mensagem para WhatsApp
    const serviceLabel = serviceOptions.find((s) => s.id === service)?.label;
    const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const message = encodeURIComponent(
      `Olá! Gostaria de agendar uma prova de vestido.\n\n` +
      `👤 Nome: ${name}\n` +
      `📱 Telefone: ${phone}\n` +
      `✨ Tipo: ${serviceLabel}\n` +
      `📅 Data preferida: ${formattedDate}\n\n` +
      `Aguardo confirmação. Obrigada!`
    );

    // Abrir WhatsApp (substitua pelo número real)
    const whatsappNumber = "5511999999999";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    toast({
      title: "Agendamento enviado! 🎉",
      description: "Você será redirecionada para o WhatsApp para confirmar.",
    });

    setIsSubmitting(false);
    setName("");
    setPhone("");
    setService("");
    setDate(undefined);
  };

  return (
    <section id="agendamento" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm">
              Agende Sua Prova
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
              Reserve Seu <span className="italic text-primary">Momento</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Preencha o formulário abaixo e entraremos em contato pelo WhatsApp para confirmar sua prova.
            </p>
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
            <div className="mb-6">
              <Label htmlFor="name" className="text-foreground font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Seu Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Telefone */}
            <div className="mb-6">
              <Label htmlFor="phone" className="text-foreground font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                WhatsApp
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="mt-2 h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Tipo de Vestido */}
            <div className="mb-6">
              <Label className="text-foreground font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Tipo de Vestido
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {serviceOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setService(option.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 text-left",
                      service === option.id
                        ? "border-primary bg-blush shadow-soft"
                        : "border-border bg-background hover:border-primary/50 hover:bg-blush/50"
                    )}
                  >
                    <span className="text-2xl mb-1 block">{option.icon}</span>
                    <span className={cn(
                      "font-medium",
                      service === option.id ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Data */}
            <div className="mb-8">
              <Label className="text-foreground font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Data Preferida
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 rounded-xl mt-2 bg-background border-border hover:bg-blush/50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg shadow-soft hover:shadow-glow transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar pelo WhatsApp
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
};

export default BookingForm;
