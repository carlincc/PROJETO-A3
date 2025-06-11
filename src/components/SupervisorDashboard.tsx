
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { toast } from '@/hooks/use-toast';
import { Plus, Users, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export function SupervisorDashboard() {
  const { user } = useAuth();
  const { tasks, addTask, getTasksByEmployee } = useTasks();
  const { users, loadUsers } = useUsers();
  
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'media' as 'baixa' | 'media' | 'alta',
    dueDate: ''
  });

  // Filtrar apenas funcionários para mostrar na lista
  const employees = users.filter(u => u.type === 'funcionario');

  console.log('All users:', users);
  console.log('Filtered employees:', employees);

  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    try {
      await loadUsers();
      toast({
        title: "Usuários atualizados",
        description: "Lista de funcionários foi recarregada",
      });
    } catch (error) {
      console.error('Error refreshing users:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    addTask({
      ...newTask,
      assignedBy: user?.id || '',
      status: 'pendente',
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
    });

    toast({
      title: "Tarefa criada!",
      description: "A tarefa foi criada e atribuída com sucesso.",
    });

    // Reset form
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'media',
      dueDate: ''
    });
    setShowNewTaskForm(false);
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'pendente').length;
  const completedTasks = tasks.filter(task => task.status === 'concluida').length;
  const inProgressTasks = tasks.filter(task => task.status === 'em_andamento').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard do Supervisor</h2>
          <p className="text-gray-600">Gerencie tarefas e monitore a equipe</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleRefreshUsers}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Recarregar Funcionários
          </Button>
          <Button 
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Criar Nova Tarefa</CardTitle>
            <CardDescription>Atribua uma nova tarefa para um funcionário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Tarefa *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Ex: Organizar vitrine de verão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Atribuir para *</Label>
                <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={employees.length > 0 ? "Selecione um funcionário" : "Nenhum funcionário encontrado - clique em Recarregar"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department || 'Sem departamento'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Descreva detalhes da tarefa..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Prazo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateTask} 
                className="bg-green-600 hover:bg-green-700"
                disabled={employees.length === 0}
              >
                Criar Tarefa
              </Button>
              <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                Cancelar
              </Button>
            </div>
            
            {employees.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  <strong>Aviso:</strong> Nenhum funcionário encontrado. Clique em "Recarregar Funcionários" ou peça ao gerente para cadastrar funcionários.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tasks Overview by Employee */}
      {employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((employee) => {
            const employeeTasks = getTasksByEmployee(employee.id);
            const pending = employeeTasks.filter(t => t.status === 'pendente').length;
            const completed = employeeTasks.filter(t => t.status === 'concluida').length;
            
            return (
              <Card key={employee.id} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{employee.name}</CardTitle>
                  <CardDescription>{employee.department || 'Sem departamento'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de tarefas:</span>
                      <Badge variant="outline">{employeeTasks.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pendentes:</span>
                      <Badge className="bg-orange-100 text-orange-800">{pending}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Concluídas:</span>
                      <Badge className="bg-green-100 text-green-800">{completed}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Recentes</CardTitle>
          <CardDescription>Últimas tarefas criadas e atualizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => {
                const employee = employees.find(e => e.id === task.assignedTo);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        Atribuída para: {employee?.name || 'Funcionário não encontrado'}
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
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Nenhuma tarefa criada ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
