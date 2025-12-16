// ==========================================
// ORGANISM: Service Selector
// Grid de seleção de serviços do backend
// ==========================================

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/molecules';
import { ServiceCard } from '@/components/molecules';
import { LoadingSpinner } from '@/components/atoms';
import type { ServiceType } from '@/types';

interface ServiceSelectorProps {
  services: ServiceType[];
  selectedService: string;
  onSelectService: (id: string) => void;
  otherServiceValue: string;
  onOtherServiceChange: (value: string) => void;
  isLoading?: boolean;
}

export function ServiceSelector({
  services,
  selectedService,
  onSelectService,
  otherServiceValue,
  onOtherServiceChange,
  isLoading = false,
}: ServiceSelectorProps) {
  const showOtherInput = selectedService === 'outro';

  if (isLoading) {
    return (
      <FormField icon={<Sparkles />} label="Tipo de Vestido">
        <div className="flex items-center justify-center py-8 gap-2">
          <LoadingSpinner />
          <span className="text-muted-foreground">Carregando serviços...</span>
        </div>
      </FormField>
    );
  }

  return (
    <FormField icon={<Sparkles />} label="Tipo de Vestido">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedService === service.id}
            onSelect={onSelectService}
          />
        ))}
      </div>

      {showOtherInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4"
        >
          <Input
            type="text"
            placeholder="Especifique o tipo de vestido..."
            value={otherServiceValue}
            onChange={(e) => onOtherServiceChange(e.target.value)}
            className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
          />
        </motion.div>
      )}
    </FormField>
  );
}
