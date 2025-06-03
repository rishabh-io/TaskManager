import { useState, useEffect } from 'react';
import { Rocket, Users, FileText, Bell } from 'lucide-react';
import TasksTab from './components/TasksTab';
import TeamTab from './components/TeamTab';
import ReportsTab from './components/ReportsTab';
import NotificationsTab from './components/NotificationsTab';
import { Task, TeamMember, Notification } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'team' | 'reports' | 'notifications'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with sample data
    setTeamMembers([
      { id: 1, name: 'Sarah Johnson', role: 'Social Media Manager', email: 'sarah@company.com', level: 'Senior' },
      { id: 2, name: 'Mike Chen', role: 'Content Creator', email: 'mike@company.com', level: 'Mid-level' },
      { id: 3, name: 'Emily Rodriguez', role: 'SEO Specialist', email: 'emily@company.com', level: 'Senior' }
    ]);

    setTasks([
      {
        id: 1,
        title: 'Instagram Campaign Launch',
        assignedTo: 1,
        priority: 'high',
        dueDate: '2025-06-10',
        description: 'Create and launch summer campaign',
        status: 'in-progress',
        createdAt: new Date('2025-05-28'),
        assignedDate: new Date('2025-05-28')
      },
      {
        id: 2,
        title: 'Blog Content Strategy',
        assignedTo: 2,
        priority: 'medium',
        dueDate: '2025-06-15',
        description: 'Develop Q3 content calendar',
        status: 'pending',
        createdAt: new Date('2025-05-30'),
        assignedDate: new Date('2025-05-30')
      }
    ]);
  }, []);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Rocket className="w-10 h-10" />
            Digital Marketing Team Manager
          </h1>
          <p className="text-gray-600 mt-2">Streamline your team's workflow and boost productivity</p>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <FileText className="w-5 h-5" /> Tasks
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Users className="w-5 h-5" /> Team
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <FileText className="w-5 h-5" /> Reports
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              setTasks={setTasks}
              teamMembers={teamMembers}
              addNotification={addNotification}
            />
          )}
          {activeTab === 'team' && (
            <TeamTab
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              tasks={tasks}
              setTasks={setTasks}
              addNotification={addNotification}
            />
          )}
          {activeTab === 'reports' && (
            <ReportsTab
              tasks={tasks}
              teamMembers={teamMembers}
              addNotification={addNotification}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              removeNotification={removeNotification}
            />
          )}
        </div>
      </div>
    </div>
  );
}