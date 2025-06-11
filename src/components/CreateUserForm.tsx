
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { User } from '../types';
import { UserPlus, Building } from 'lucide-react';

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: Omit<User, 'id'> & { password: string }) => void;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  type: 'funcionario' | 'supervisor' | 'gerente';
  department: string;
}

export function CreateUserForm({ isOpen, onClose, onCreateUser }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      type: 'funcionario',
      department: ''
    }
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onCreateUser(data);
    setIsLoading(false);
    form.reset();
    onClose();
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'funcionario': return 'Funcionário';
      case 'supervisor': return 'Supervisor';
      case 'gerente': return 'Gerente';
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Criar Nova Conta
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova conta de usuário.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Digite o email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{ 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite a senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              rules={{ required: 'Tipo de usuário é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="funcionario">Funcionário</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="gerente">Gerente</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              rules={{ required: 'Departamento é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    Departamento
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecione o departamento</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Estoque">Estoque</option>
                      <option value="Gestão">Gestão</option>
                      <option value="Administração">Administração</option>
                      <option value="Atendimento">Atendimento</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Conta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
