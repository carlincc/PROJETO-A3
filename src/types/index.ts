
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'funcionario' | 'supervisor' | 'gerente';
  department?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  priority: 'baixa' | 'media' | 'alta';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

export interface Report {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  employeesWithoutTasks: number;
  tasksByEmployee: { [key: string]: number };
  recentActivity: Task[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (email: string, password: string, userData: { name: string; type: string; department?: string }) => Promise<boolean>;
  isLoading: boolean;
}
