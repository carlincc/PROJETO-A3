
import React, { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Shield } from 'lucide-react';

export function InitialSetup() {
  const { getAllUsers, createUser } = useUsers();
  const { user } = useAuth();
  const [isCreatingManager, setIsCreatingManager] = useState(false);
  const [managerCreated, setManagerCreated] = useState(false);
  
  const allUsers = getAllUsers();
  const hasManager = allUsers.some(u => u.type === 'gerente');

  useEffect(() => {
    // Se já tem um gerente ou já criamos um, não mostrar
    if (hasManager || managerCreated) return;
  }, [hasManager, managerCreated]);

  const createInitialManager = async () => {
    setIsCreatingManager(true);
    
    const success = await createUser({
      name: 'Gerente do Sistema',
      email: 'gerente@loja.com',
      password: '123456',
      type: 'gerente',
      department: 'Administração'
    });

    if (success) {
      setManagerCreated(true);
    }
    
    setIsCreatingManager(false);
  };

  // Não mostrar se já existe um gerente, se já criamos um, ou se alguém já está logado
  if (hasManager || managerCreated || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>Configuração Inicial</CardTitle>
          <CardDescription>
            O sistema precisa de um gerente para funcionar. Clique no botão abaixo para criar o usuário gerente padrão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Credenciais do Gerente:</h4>
            <p className="text-sm text-blue-800">
              <strong>Email:</strong> gerente@loja.com<br />
              <strong>Senha:</strong> 123456<br />
              <strong>Tipo:</strong> Gerente<br />
              <strong>Departamento:</strong> Administração
            </p>
          </div>
          
          <Button 
            onClick={createInitialManager}
            disabled={isCreatingManager}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isCreatingManager ? 'Criando Gerente...' : 'Criar Gerente Inicial'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
