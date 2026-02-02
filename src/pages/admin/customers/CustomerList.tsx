// ==========================================
// Lista de Clientes Admin
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/atoms';
import { customerService } from '@/services/admin';
import useDebounce from '../../../hooks/useDebounce';
import type { Customer } from '@/types/admin';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Carregar clientes inicialmente
  useEffect(() => {
    loadCustomers();
  }, []);

  // Buscar quando termo muda
  useEffect(() => {
    if (debouncedSearch) {
      searchCustomers(debouncedSearch);
    } else if (debouncedSearch === '') {
      loadCustomers();
    }
  }, [debouncedSearch]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCustomers = async (filter: string) => {
    setIsSearching(true);
    try {
      const data = await customerService.search(filter);
      setCustomers(data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-medium text-gray-900">
            Clientes
          </h1>
          <p className="text-gray-500 mt-1">
            {customers.length} cliente(s) encontrado(s)
          </p>
        </div>

        <Link to="/admin/customers/new">
          <Button className="rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 rounded-xl"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Customer List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando seu primeiro cliente'}
          </p>
          {!searchTerm && (
            <Link to="/admin/customers/new">
              <Button className="rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Cliente
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {customers.map((customer, index) => (
              <motion.div
                key={customer.customerId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/admin/customers/${customer.customerId}`}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        {customer.hasUserAccount && (
                          <Badge variant={customer.isUserActive ? 'default' : 'secondary'} className="text-xs">
                            {customer.isUserActive ? 'Conta Ativa' : 'Conta Inativa'}
                          </Badge>
                        )}
                        {!customer.hasCompleteRegistration && (
                          <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                            Cadastro Incompleto
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {formatPhone(customer.phone)}
                        </span>
                        {customer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
