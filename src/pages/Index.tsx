
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { Layout } from '../components/Layout';
import { FuncionarioDashboard } from '../components/FuncionarioDashboard';
import { SupervisorDashboard } from '../components/SupervisorDashboard';
import { GerenteDashboard } from '../components/GerenteDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.type) {
      case 'funcionario':
        return <FuncionarioDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'gerente':
        return <GerenteDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">Tipo de usuário não reconhecido</h2>
            <p className="text-gray-600 mt-2">Entre em contato com o administrador do sistema.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default Index;
