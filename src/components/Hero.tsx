import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-boutique.jpg";

const Hero = () => {
  const scrollToBooking = () => {
    document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Boutique de vestidos elegante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-primary font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Atelier de Vestidos
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-6 leading-tight"
        >
          Seu Momento
          <span className="block italic text-primary">Especial</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Agende sua prova de vestido para noivas, debutantes, madrinhas e daminhas. 
          Transformamos sonhos em realidade com atendimento exclusivo e personalizado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <button
            onClick={scrollToBooking}
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium text-lg shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            Agendar Prova
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <ArrowDown className="w-6 h-6 text-primary/60" />
      </motion.div>
    </section>
  );
};

export default Hero;
