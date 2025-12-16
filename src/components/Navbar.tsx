import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-2xl font-medium text-foreground"
          >
            Atelier
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("servicos")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollTo("agendamento")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Agendamento
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo("agendamento")}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:shadow-soft transition-all duration-300 hover:scale-105"
            >
              Agendar Prova
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border py-6 px-4"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollTo("servicos")}
                className="text-foreground hover:text-primary transition-colors py-2 text-left"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollTo("agendamento")}
                className="text-foreground hover:text-primary transition-colors py-2 text-left"
              >
                Agendamento
              </button>
              <button
                onClick={() => scrollTo("faq")}
                className="text-foreground hover:text-primary transition-colors py-2 text-left"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollTo("agendamento")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium mt-2"
              >
                Agendar Prova
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
