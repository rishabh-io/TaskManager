export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  level: 'Junior' | 'Mid-level' | 'Senior';
}

export interface Task {
  id: number;
  title: string;
  assignedTo: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  assignedDate: Date;
  selected?: boolean;
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent' | 'error';
  timestamp: Date;
}

export interface CelebrationConfig {
  show: boolean;
  message: string;
  subMessage?: string;
}