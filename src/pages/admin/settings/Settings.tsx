// ==========================================
// Configurações Gerais Admin
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Bell,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/atoms';
import { settingsService } from '@/services/admin';
import { toast } from '@/hooks/use-toast';
import type { GeneralSettings } from '@/types/admin';

export function Settings() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [studioName, setStudioName] = useState('');
  const [studioEmail, setStudioEmail] = useState('');
  const [studioPhone, setStudioPhone] = useState('');
  const [studioWhatsApp, setStudioWhatsApp] = useState('');
  const [studioAddress, setStudioAddress] = useState('');
  const [studioDescription, setStudioDescription] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [whatsAppNotifications, setWhatsAppNotifications] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [newAppointmentAlert, setNewAppointmentAlert] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getGeneralSettings();
      setSettings(data);

      // Popular formulário
      setStudioName(data.studioInfo.name);
      setStudioEmail(data.studioInfo.email);
      setStudioPhone(data.studioInfo.phone);
      setStudioWhatsApp(data.studioInfo.whatsApp);
      setStudioAddress(data.studioInfo.address);
      setStudioDescription(data.studioInfo.description);

      setEmailNotifications(data.notifications.emailNotificationsEnabled);
      setWhatsAppNotifications(data.notifications.whatsAppNotificationsEnabled);
      setDailyReport(data.notifications.dailyReportEnabled);
      setNewAppointmentAlert(data.notifications.newAppointmentAlertEnabled);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsService.saveGeneralSettings({
        studioInfo: {
          name: studioName,
          email: studioEmail,
          phone: studioPhone,
          whatsApp: studioWhatsApp,
          address: studioAddress,
          description: studioDescription,
        },
        notifications: {
          emailNotificationsEnabled: emailNotifications,
          whatsAppNotificationsEnabled: whatsAppNotifications,
          dailyReportEnabled: dailyReport,
          newAppointmentAlertEnabled: newAppointmentAlert,
        },
      });

      toast({
        title: 'Configurações salvas! ✅',
        description: 'As alterações foram aplicadas com sucesso.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Erro ao salvar',
        description: (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-medium text-gray-900">
          Configurações
        </h1>
        <p className="text-gray-500 mt-1">
          Gerencie as informações do seu ateliê
        </p>
      </div>

      {/* Informações do Ateliê */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Informações do Ateliê
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Ateliê
            </label>
            <Input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                E-mail
              </label>
              <Input
                type="email"
                value={studioEmail}
                onChange={(e) => setStudioEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone
              </label>
              <Input
                type="tel"
                value={studioPhone}
                onChange={(e) => setStudioPhone(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              WhatsApp
            </label>
            <Input
              type="tel"
              value={studioWhatsApp}
              onChange={(e) => setStudioWhatsApp(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Endereço
            </label>
            <Input
              type="text"
              value={studioAddress}
              onChange={(e) => setStudioAddress(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <Textarea
              value={studioDescription}
              onChange={(e) => setStudioDescription(e.target.value)}
              className="rounded-xl min-h-[100px]"
              placeholder="Fale um pouco sobre o ateliê..."
            />
          </div>
        </div>
      </motion.div>

      {/* Notificações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notificações
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por E-mail</p>
              <p className="text-sm text-gray-500">
                Receba atualizações por e-mail
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por WhatsApp</p>
              <p className="text-sm text-gray-500">
                Receba lembretes pelo WhatsApp
              </p>
            </div>
            <Switch
              checked={whatsAppNotifications}
              onCheckedChange={setWhatsAppNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Relatório Diário</p>
              <p className="text-sm text-gray-500">
                Receba um resumo diário dos agendamentos
              </p>
            </div>
            <Switch
              checked={dailyReport}
              onCheckedChange={setDailyReport}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Alerta de Novo Agendamento</p>
              <p className="text-sm text-gray-500">
                Seja notificado quando um novo agendamento for criado
              </p>
            </div>
            <Switch
              checked={newAppointmentAlert}
              onCheckedChange={setNewAppointmentAlert}
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl px-8"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Salvar Configurações
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Settings;
