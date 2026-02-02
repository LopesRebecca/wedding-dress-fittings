// ==========================================
// MOLECULE: Companions Checkbox
// Checkbox para acompanhantes com campo numérico
// ==========================================

import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface CompanionsCheckboxProps {
  hasCompanions: boolean;
  onHasCompanionsChange: (value: boolean) => void;
  companionsCount: string;
  onCompanionsCountChange: (value: string) => void;
  createAccount: boolean;
  onCreateAccountChange: (value: boolean) => void;
}

export function CompanionsCheckbox({
  hasCompanions,
  onHasCompanionsChange,
  companionsCount,
  onCompanionsCountChange,
  createAccount,
  onCreateAccountChange,
}: CompanionsCheckboxProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Checkbox de Acompanhantes */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="hasCompanions"
            checked={hasCompanions}
            onCheckedChange={(checked) => {
              onHasCompanionsChange(checked as boolean);
              if (!checked) onCompanionsCountChange("");
            }}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="hasCompanions"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Vou com acompanhante(s)
          </label>
        </div>

        {/* Checkbox de Criar Conta */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="createAccount"
            checked={createAccount}
            onCheckedChange={(checked) => onCreateAccountChange(checked as boolean)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="createAccount"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Quero criar uma conta
          </label>
        </div>
      </div>

      {hasCompanions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Input
            type="number"
            min="1"
            max="10"
            placeholder="Quantas pessoas irão com você?"
            value={companionsCount}
            onChange={(e) => onCompanionsCountChange(e.target.value)}
            className="h-12 rounded-xl bg-background border-border focus:border-primary focus:ring-primary/20"
          />
        </motion.div>
      )}
    </div>
  );
}
