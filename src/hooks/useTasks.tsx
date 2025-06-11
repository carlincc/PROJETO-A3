
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  completeTask: (id: string) => Promise<boolean>;
  getTasksByEmployee: (employeeId: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (tasksData) {
        const formattedTasks: Task[] = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          assignedTo: task.assigned_to,
          assignedBy: task.assigned_by,
          status: task.status as 'pendente' | 'em_andamento' | 'concluida',
          priority: task.priority as 'baixa' | 'media' | 'alta',
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          completedAt: task.completed_at ? new Date(task.completed_at) : undefined
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tarefas",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          assigned_to: taskData.assignedTo,
          assigned_by: user.id,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate?.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          assignedTo: data.assigned_to,
          assignedBy: data.assigned_by,
          status: data.status as 'pendente' | 'em_andamento' | 'concluida',
          priority: data.priority as 'baixa' | 'media' | 'alta',
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          dueDate: data.due_date ? new Date(data.due_date) : undefined,
          completedAt: data.completed_at ? new Date(data.completed_at) : undefined
        };
        setTasks(prev => [newTask, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.dueDate) updateData.due_date = updates.dueDate.toISOString();
      if (updates.completedAt) updateData.completed_at = updates.completedAt.toISOString();

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ));
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tarefa",
        variant: "destructive"
      });
      return false;
    }
  };

  const completeTask = async (id: string): Promise<boolean> => {
    return updateTask(id, { 
      status: 'concluida', 
      completedAt: new Date() 
    });
  };

  const getTasksByEmployee = (employeeId: string) => {
    return tasks.filter(task => task.assignedTo === employeeId);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      completeTask,
      getTasksByEmployee,
      getTasksByStatus,
      loadTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
