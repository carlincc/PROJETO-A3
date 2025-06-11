
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { User, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  const getUserRoleColor = (type: string) => {
    switch (type) {
      case 'funcionario': return 'bg-green-100 text-green-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'gerente': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserRoleLabel = (type: string) => {
    switch (type) {
      case 'funcionario': return 'Funcionário';
      case 'supervisor': return 'Supervisor';
      case 'gerente': return 'Gerente';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Fashion Store</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUserRoleColor(user?.type || '')}`}>
                {getUserRoleLabel(user?.type || '')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
