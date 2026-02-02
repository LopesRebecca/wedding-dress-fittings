import { motion } from "framer-motion";
import { Heart, Instagram, MessageCircle, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Content - Side by Side */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Info Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
              {/* Brand */}
              <div>
                <h3 className="font-display text-xl text-background">
                  Atelier Carvalho
                </h3>
                <p className="text-background/50 text-sm">
                  Transformando sonhos em realidade
                </p>
              </div>

              {/* Divider - Desktop */}
              <div className="hidden sm:block w-px h-10 bg-background/20" />

              {/* Address */}
              <div className="flex items-center gap-2 text-background/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>R. Cel. Costa Pereira, 100, Itaguaí - RJ</span>
              </div>

              {/* Divider - Desktop */}
              <div className="hidden sm:block w-px h-10 bg-background/20" />

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/ateliecarvalho.oficial?igsh=bTBvMHp0YWk3bnc4"
                  className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/5521982495227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-green-500 hover:text-white transition-all duration-300"
                  aria-label="WhatsApp"
                  title="Aninha Freire"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/5521964723412"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-green-500 hover:text-white transition-all duration-300"
                  aria-label="WhatsApp"
                  title="Mônica Carvalho"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-background/10 my-4" />

          {/* Copyright */}
          <p className="text-background/40 text-xs flex items-center justify-center gap-1">
            Feito com <Heart className="w-3 h-3 text-primary fill-primary" /> para momentos especiais
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
