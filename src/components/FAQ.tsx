import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o agendamento da prova?",
    answer: "Após preencher o formulário, entraremos em contato pelo WhatsApp para confirmar a data e horário. Recomendamos agendar com pelo menos 1 semana de antecedência para garantir disponibilidade."
  },
  {
    question: "Quanto tempo dura uma prova de vestido?",
    answer: "A prova dura em média de 1 a 2 horas, dependendo do tipo de vestido. Para noivas, reservamos um tempo maior para garantir uma experiência tranquila e especial."
  },
  {
    question: "Posso levar acompanhantes na prova?",
    answer: "Sim! Recomendamos levar até 3 acompanhantes para ajudar na escolha. Para grupos maiores, entre em contato conosco para verificar disponibilidade de espaço."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartões de crédito (parcelamento em até 12x), débito, PIX e dinheiro. Oferecemos condições especiais para pagamento à vista."
  },
  {
    question: "Vocês fazem ajustes nos vestidos?",
    answer: "Sim! Contamos com costureiras especializadas que realizam todos os ajustes necessários para que o vestido fique perfeito em você. Os ajustes são cobrados à parte."
  },
  {
    question: "Qual o prazo para entrega do vestido?",
    answer: "Para vestidos de aluguel, recomendamos retirar 2 dias antes do evento. Para vestidos sob encomenda, o prazo varia de 60 a 90 dias dependendo do modelo."
  },
  {
    question: "Vocês trabalham com aluguel ou venda?",
    answer: "Trabalhamos com ambas as opções! Temos vestidos disponíveis para aluguel e também modelos exclusivos para compra. Consulte-nos sobre as opções disponíveis."
  },
  {
    question: "Qual a política de cancelamento?",
    answer: "Cancelamentos devem ser feitos com no mínimo 48 horas de antecedência. Para vestidos reservados, consulte nossa política de reembolso específica."
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm">
            Dúvidas Frequentes
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mt-4">
            Perguntas <span className="italic text-primary">Frequentes</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mt-4">
            Tire suas dúvidas sobre nossos serviços e políticas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl border border-border/50 px-6 shadow-card data-[state=open]:shadow-soft transition-shadow"
              >
                <AccordionTrigger className="text-left font-display text-lg font-medium text-foreground hover:text-primary py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
