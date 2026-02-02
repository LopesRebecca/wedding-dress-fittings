// ==========================================
// Novo Cliente Admin
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Lock,
  ArrowLeft,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/atoms';
import { customerService } from '@/services/admin';
import { toast } from '@/hooks/use-toast';

export function NewCustomer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [createUserAccount, setCreateUserAccount] = useState(false);
  const [password, setPassword] = useState('');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e telefone são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (createUserAccount && !password) {
      toast({
        title: 'Senha obrigatória',
        description: 'Informe uma senha para criar a conta.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await customerService.create({
        name,
        phone: phone.replace(/\D/g, ''),
        email: email || undefined,
        taxNumber: taxNumber || undefined,
        createUserAccount,
        password: createUserAccount ? password : undefined,
      });

      toast({
        title: 'Cliente cadastrado! ✅',
        description: response.message,
      });

      navigate(`/admin/customers/${response.customerId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Tente novamente.';
      
      toast({
        title: 'Erro ao cadastrar',
        description: errorMessage,
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
          Novo Cliente
        </h1>
        <p className="text-gray-500 mt-1">
          Preencha os dados para cadastrar um novo cliente
        </p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6"
      >
        {/* Nome */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Nome Completo *
          </label>
          <Input
            type="text"
            placeholder="Maria Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            Telefone (WhatsApp) *
          </label>
          <Input
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            maxLength={15}
            className="h-12 rounded-xl"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            E-mail
          </label>
          <Input
            type="email"
            placeholder="maria@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* CPF/CNPJ */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            CPF/CNPJ
          </label>
          <Input
            type="text"
            placeholder="000.000.000-00"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* Criar conta */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Checkbox
              id="createAccount"
              checked={createUserAccount}
              onCheckedChange={(checked) => setCreateUserAccount(checked as boolean)}
            />
            <label
              htmlFor="createAccount"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Criar conta de acesso para este cliente
            </label>
          </div>

          {createUserAccount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                Senha de acesso *
              </label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="h-12 rounded-xl"
              />
            </motion.div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 h-12 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Salvando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Salvar Cliente
              </span>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}

export default NewCustomer;
