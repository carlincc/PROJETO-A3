
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (session?.user) {
        // Defer profile loading to prevent deadlocks
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 100);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, retryCount = 0) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        // Se não encontrou o perfil e ainda não tentou muitas vezes, tenta novamente
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log(`Profile not found, retrying... (attempt ${retryCount + 1})`);
          setTimeout(() => {
            loadUserProfile(userId, retryCount + 1);
          }, 1000);
          return;
        }
        throw error;
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          type: profile.type as 'funcionario' | 'supervisor' | 'gerente',
          department: profile.department
        });
      } else {
        // Se ainda não existe perfil após as tentativas, pode ser um usuário recém-criado
        if (retryCount < 3) {
          console.log(`Profile not found, retrying... (attempt ${retryCount + 1})`);
          setTimeout(() => {
            loadUserProfile(userId, retryCount + 1);
          }, 1000);
          return;
        }
        
        console.log('Profile not found after retries, user may need to complete setup');
        toast({
          title: "Perfil não encontrado",
          description: "Seu perfil está sendo configurado. Tente fazer login novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil do usuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Tratamento específico para diferentes tipos de erro
        if (error.message === 'Email not confirmed') {
          toast({
            title: "Email não confirmado",
            description: "Verifique sua caixa de entrada e confirme seu email antes de fazer login.",
            variant: "destructive"
          });
        } else if (error.message === 'Invalid login credentials') {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro de login",
            description: error.message,
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o login",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; type: string; department?: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada!",
          description: "Sua conta foi criada com sucesso. Você já está logado.",
        });
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('SignUp error:', error);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
