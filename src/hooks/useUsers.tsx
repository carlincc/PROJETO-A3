
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UsersContextType {
  users: User[];
  createUser: (userData: { name: string; email: string; password: string; type: string; department?: string }) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
  getAllUsers: () => User[];
  loadUsers: () => Promise<void>;
  isCreatingUser: boolean;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const { user } = useAuth();

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading users:', error);
        throw error;
      }

      if (profiles) {
        console.log('Loaded profiles:', profiles);
        const formattedUsers: User[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          type: profile.type as 'funcionario' | 'supervisor' | 'gerente',
          department: profile.department
        }));
        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('useUsers effect - user:', user);
    if (user) {
      loadUsers();
    }
  }, [user]);

  // Recarregar usuários quando o componente é montado
  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (userData: { name: string; email: string; password: string; type: string; department?: string }): Promise<boolean> => {
    setIsCreatingUser(true);
    
    try {
      // Verificar se há pelo menos um gerente no sistema
      const hasManager = users.some(u => u.type === 'gerente');
      
      // Permitir criação se for o primeiro gerente OU se o usuário logado for gerente
      if (!hasManager || user?.type === 'gerente') {
        // Prosseguir com a criação
      } else {
        toast({
          title: "Acesso negado",
          description: "Apenas gerentes podem criar usuários",
          variant: "destructive"
        });
        return false;
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Erro",
          description: "Já existe um usuário com este email",
          variant: "destructive"
        });
        return false;
      }

      console.log('Creating user with signup method...');
      
      // Usar método de signup normal
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            type: userData.type,
            department: userData.department
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Aguardar um pouco para garantir que o trigger da database funcionou
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Fazer logout do usuário recém-criado para manter o gerente logado
        await supabase.auth.signOut();
        
        const userTypeMessage = userData.type === 'gerente' ? 'Gerente' : 'Usuário';
        toast({
          title: `${userTypeMessage} criado!`,
          description: `O novo ${userData.type} foi criado com sucesso`,
        });
        
        // Reload users to show the new one
        await loadUsers();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsCreatingUser(false);
    }
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  return (
    <UsersContext.Provider value={{ users, createUser, getUserById, getAllUsers, loadUsers, isCreatingUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
