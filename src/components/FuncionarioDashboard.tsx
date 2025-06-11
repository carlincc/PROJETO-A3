
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function FuncionarioDashboard() {
  const { user } = useAuth();
  const { getTasksByEmployee, completeTask } = useTasks();
  
  const myTasks = user ? getTasksByEmployee(user.id) : [];
  const pendingTasks = myTasks.filter(task => task.status === 'pendente');
  const inProgressTasks = myTasks.filter(task => task.status === 'em_andamento');
  const completedTasks = myTasks.filter(task => task.status === 'concluida');

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    toast({
      title: "Tarefa concluída!",
      description: "A tarefa foi marcada como concluída com sucesso.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return <AlertCircle className="h-4 w-4" />;
      case 'media': return <Clock className="h-4 w-4" />;
      case 'baixa': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard do Funcionário</h2>
        <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Tarefas</CardTitle>
          <CardDescription>Lista de todas as suas tarefas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma tarefa atribuída no momento</p>
              </div>
            ) : (
              myTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(task.priority)}
                          <span className="capitalize">{task.priority}</span>
                        </div>
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
                  
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  
                  {task.status !== 'concluida' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Concluída
                    </Button>
                  )}
                  
                  {task.completedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Concluída em: {new Date(task.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
