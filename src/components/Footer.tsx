import { motion } from "framer-motion";
import { Heart, Instagram, MessageCircle, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-display text-3xl text-background mb-4">
            Atelier de Vestidos
          </h3>
          <p className="text-background/60 max-w-md mx-auto mb-8">
            Transformando sonhos em realidade, um vestido de cada vez.
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-green-500 hover:text-white transition-all duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Address */}
          <div className="flex items-center justify-center gap-2 text-background/60 mb-8">
            <MapPin className="w-4 h-4" />
            <span>Rua das Flores, 123 - Centro - São Paulo, SP</span>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-background/20 mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-background/40 text-sm flex items-center justify-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para momentos especiais
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
