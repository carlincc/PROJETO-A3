import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { CreateUserForm } from './CreateUserForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ClipboardList, CheckCircle, Clock, AlertTriangle, FileText, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function GerenteDashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { getAllUsers, createUser } = useUsers();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const allUsers = getAllUsers();
  const employees = allUsers.filter(u => u.type === 'funcionario');

  // Calculate reports data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'concluida').length;
  const pendingTasks = tasks.filter(task => task.status === 'pendente').length;
  const inProgressTasks = tasks.filter(task => task.status === 'em_andamento').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Employees without pending tasks
  const employeesWithoutTasks = employees.filter(employee => {
    const employeeTasks = tasks.filter(task => task.assignedTo === employee.id && task.status === 'pendente');
    return employeeTasks.length === 0;
  });

  // Tasks by employee data for chart
  const tasksByEmployee = employees.map(employee => {
    const employeeTasks = tasks.filter(task => task.assignedTo === employee.id);
    return {
      name: employee.name,
      total: employeeTasks.length,
      completed: employeeTasks.filter(t => t.status === 'concluida').length,
      pending: employeeTasks.filter(t => t.status === 'pendente').length,
      inProgress: employeeTasks.filter(t => t.status === 'em_andamento').length
    };
  });

  // Status distribution data for pie chart
  const statusDistribution = [
    { name: 'Concluídas', value: completedTasks, color: '#10b981' },
    { name: 'Em Andamento', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Pendentes', value: pendingTasks, color: '#ef4444' }
  ];

  // Priority distribution
  const priorityStats = {
    alta: tasks.filter(t => t.priority === 'alta').length,
    media: tasks.filter(t => t.priority === 'media').length,
    baixa: tasks.filter(t => t.priority === 'baixa').length
  };

  // Recent activity (last 5 tasks)
  const recentActivity = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData);
    
    if (success) {
      toast({
        title: "Usuário criado com sucesso!",
        description: `${userData.name} foi adicionado como ${userData.type}.`,
      });
    } else {
      toast({
        title: "Erro ao criar usuário",
        description: "Email já existe ou você não tem permissão.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard do Gerente</h2>
          <p className="text-gray-600">Relatórios e acompanhamento geral da empresa</p>
        </div>
        <Button 
          onClick={() => setIsCreateUserModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Criar Usuário
        </Button>
      </div>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>Total de usuários cadastrados: {allUsers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {allUsers.filter(u => u.type === 'funcionario').length}
              </div>
              <p className="text-sm text-green-800">Funcionários</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {allUsers.filter(u => u.type === 'supervisor').length}
              </div>
              <p className="text-sm text-blue-800">Supervisores</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {allUsers.filter(u => u.type === 'gerente').length}
              </div>
              <p className="text-sm text-purple-800">Gerentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? 'Tarefas cadastradas' : 'Nenhuma tarefa'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} de {totalTasks} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Livres</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{employeesWithoutTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Sem tarefas pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando execução
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Employee Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Funcionário</CardTitle>
            <CardDescription>Distribuição de tarefas entre funcionários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Concluídas" />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="Em Andamento" />
                  <Bar dataKey="pending" stackId="a" fill="#ef4444" name="Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Status atual de todas as tarefas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Análise por Prioridade
            </CardTitle>
            <CardDescription>Distribuição de tarefas por nível de prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-medium">Alta Prioridade</span>
                </div>
                <Badge className="bg-red-100 text-red-800">{priorityStats.alta}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium">Média Prioridade</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{priorityStats.media}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium">Baixa Prioridade</span>
                </div>
                <Badge className="bg-green-100 text-green-800">{priorityStats.baixa}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees Without Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Funcionários Disponíveis
            </CardTitle>
            <CardDescription>Funcionários sem tarefas pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employeesWithoutTasks.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Todos os funcionários têm tarefas pendentes</p>
                </div>
              ) : (
                employeesWithoutTasks.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">{employee.name}</p>
                      <p className="text-sm text-green-600">{employee.department}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Atividade Recente
          </CardTitle>
          <CardDescription>Últimas atualizações de tarefas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade recente</p>
              </div>
            ) : (
              recentActivity.map((task) => {
                const employee = employees.find(e => e.id === task.assignedTo);
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        {employee?.name || 'Funcionário não encontrado'} • {employee?.department}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Atualizada em: {new Date(task.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        task.priority === 'alta' ? 'bg-red-100 text-red-800' :
                        task.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {task.priority}
                      </Badge>
                      <Badge variant={
                        task.status === 'concluida' ? 'default' : 
                        task.status === 'em_andamento' ? 'secondary' : 'outline'
                      }>
                        {task.status === 'concluida' ? 'Concluída' : 
                         task.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <CreateUserForm 
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
}
