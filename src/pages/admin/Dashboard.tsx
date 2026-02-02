// ==========================================
// Dashboard Admin
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { appointmentService, customerService } from '@/services/admin';
import { LoadingSpinner } from '@/components/atoms';
import type { Appointment, Customer } from '@/types/admin';

interface DashboardStats {
  totalCustomers: number;
  weekAppointments: number;
  monthAppointments: number;
  todayAppointments: number;
}

export function Dashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      // Buscar dados em paralelo
      const [customers, weekData, monthData] = await Promise.all([
        customerService.getAll(),
        appointmentService.getByDateRange(
          weekStart.toISOString(),
          weekEnd.toISOString()
        ),
        appointmentService.getByDateRange(
          monthStart.toISOString(),
          monthEnd.toISOString()
        ),
      ]);

      // Filtrar agendamentos de hoje
      const todayStr = format(today, 'yyyy-MM-dd');
      const todayAppointments = weekData.appointments.filter(
        (apt) => apt.scheduledAt.startsWith(todayStr)
      );

      // Próximos agendamentos (hoje e futuros)
      const upcoming = weekData.appointments
        .filter((apt) => new Date(apt.scheduledAt) >= today)
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5);

      setStats({
        totalCustomers: customers.length,
        weekAppointments: weekData.totalCount,
        monthAppointments: monthData.totalCount,
        todayAppointments: todayAppointments.length,
      });
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Agendamentos Hoje',
      value: stats?.todayAppointments || 0,
      icon: Clock,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Esta Semana',
      value: stats?.weekAppointments || 0,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Este Mês',
      value: stats?.monthAppointments || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Total de Clientes',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-medium text-gray-900">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color.replace('bg-', '')}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Próximos Agendamentos</h2>
          <Link
            to="/admin/appointments"
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
          >
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nenhum agendamento próximo
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {apt.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {apt.fittingDetails?.dressCategory || apt.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {format(new Date(apt.scheduledAt), 'HH:mm')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(apt.scheduledAt), "dd/MM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/appointments/new"
          className="p-6 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-lg">Novo Agendamento</h3>
            <p className="text-white/80 text-sm">Agendar uma nova prova</p>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/customers/new"
          className="p-6 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-lg text-gray-900">Novo Cliente</h3>
            <p className="text-gray-500 text-sm">Cadastrar novo cliente</p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
