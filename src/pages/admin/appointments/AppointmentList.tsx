// ==========================================
// Lista de Agendamentos Admin
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Plus, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/atoms';
import { appointmentService } from '@/services/admin';
import type { Appointment } from '@/types/admin';

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getByDateRange(
        weekStart.toISOString(),
        weekEnd.toISOString()
      );
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [weekStart, weekEnd]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  // Agrupar por data
  const groupedByDate = appointments.reduce((acc, apt) => {
    const dateKey = format(new Date(apt.scheduledAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Gerar dias da semana
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-medium text-gray-900">
            Agendamentos
          </h1>
          <p className="text-gray-500 mt-1">
            {format(weekStart, "dd 'de' MMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <Link to="/admin/appointments/new">
          <Button className="rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <Button variant="outline" onClick={prevWeek} className="rounded-xl">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Semana Anterior
        </Button>
        
        <Button variant="ghost" onClick={goToToday} className="rounded-xl">
          <Calendar className="w-5 h-5 mr-2" />
          Hoje
        </Button>

        <Button variant="outline" onClick={nextWeek} className="rounded-xl">
          Próxima Semana
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Appointments Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = groupedByDate[dateKey] || [];
            const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border ${
                  isToday ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'
                } overflow-hidden`}
              >
                {/* Day Header */}
                <div className={`p-4 text-center border-b ${
                  isToday ? 'bg-primary text-white' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                    {format(day, 'EEEE', { locale: ptBR })}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {format(day, 'dd')}
                  </p>
                </div>

                {/* Appointments */}
                <div className="p-2 min-h-[200px]">
                  {dayAppointments.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">
                      Sem agendamentos
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dayAppointments
                        .sort((a, b) => 
                          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
                        )
                        .map((apt) => (
                          <Link
                            key={apt.id}
                            to={`/admin/appointments/${apt.id}`}
                            className="block p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {format(new Date(apt.scheduledAt), 'HH:mm')}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-3.5 h-3.5" />
                              <span className="truncate">{apt.customerName}</span>
                            </div>
                            <div className="mt-2">
                              {getStatusBadge(apt.status)}
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
