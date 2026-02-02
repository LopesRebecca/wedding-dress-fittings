// ==========================================
// ORGANISM: Login Modal
// Modal de login/registro
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/molecules';
import { LoadingSpinner } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalMode = 'login' | 'register';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<ModalMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModeSwitch = (newMode: ModalMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, phone, password, confirmPassword });
      }
      handleClose();
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display text-center">
            {mode === 'login' ? 'Bem-vinda de volta!' : 'Crie sua conta'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'login' ? 'Faça login na sua conta' : 'Crie uma nova conta para agendar seus serviços'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Nome (apenas no registro) */}
                {mode === 'register' && (
                  <FormField icon={<User />} label="Nome" htmlFor="auth-name">
                    <Input
                      id="auth-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
                    />
                  </FormField>
                )}

                {/* Email */}
                <FormField icon={<Mail />} label="E-mail" htmlFor="auth-email">
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
                  />
                </FormField>

                {/* Telefone (apenas no registro) */}
                {mode === 'register' && (
                  <FormField icon={<Phone />} label="WhatsApp" htmlFor="auth-phone">
                    <Input
                      id="auth-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={15}
                      required
                      className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
                    />
                  </FormField>
                )}

                {/* Senha */}
                <FormField icon={<Lock />} label="Senha" htmlFor="auth-password">
                  <div className="relative">
                    <Input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormField>

                {/* Confirmar Senha (apenas no registro) */}
                {mode === 'register' && (
                  <FormField icon={<Lock />} label="Confirmar Senha" htmlFor="auth-confirm-password">
                    <div className="relative">
                      <Input
                        id="auth-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormField>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-soft hover:shadow-glow transition-all duration-300 mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  {mode === 'login' ? 'Entrando...' : 'Cadastrando...'}
                </span>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar Conta'
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-4 p-3 rounded-xl bg-muted/50 text-center text-sm text-muted-foreground">
              <p className="font-medium mb-1">Demo para teste:</p>
              <p>E-mail: demo@email.com</p>
              <p>Senha: 123456</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
