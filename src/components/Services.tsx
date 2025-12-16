import { motion } from "framer-motion";
import { Heart, Crown, Sparkles, Star } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Noivas",
    description: "Encontre o vestido dos seus sonhos para o dia mais especial da sua vida.",
    highlight: "Atendimento VIP",
  },
  {
    icon: Crown,
    title: "Debutantes",
    description: "Brilhe em sua festa de 15 anos com um vestido deslumbrante e único.",
    highlight: "Exclusividade",
  },
  {
    icon: Sparkles,
    title: "Madrinhas",
    description: "Vestidos elegantes que complementam a cerimônia com sofisticação.",
    highlight: "Harmonia perfeita",
  },
  {
    icon: Star,
    title: "Daminhas",
    description: "Encante a todos com vestidos delicados para as pequenas princesas.",
    highlight: "Fofura garantida",
  },
];

const Services = () => {
  return (
    <section id="servicos" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm">
            Nossos Serviços
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mt-4">
            Para Cada Momento <span className="italic text-primary">Especial</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 h-full shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-border/50">
                <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                <span className="inline-block text-xs font-medium text-gold tracking-wider uppercase mb-2">
                  {service.highlight}
                </span>
                
                <h3 className="font-display text-2xl font-medium text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
