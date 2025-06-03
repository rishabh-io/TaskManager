import { useState, useEffect } from 'react';
import { Task, TeamMember, CelebrationConfig } from '../types';
import { AlertTriangle, Clock, CheckCircle, Trash2, CheckSquare, Square, UserPlus } from 'lucide-react';

interface TasksTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  teamMembers: TeamMember[];
  addNotification: (message: string, type: string) => void;
}

export default function TasksTab({ tasks, setTasks, teamMembers, addNotification }: TasksTabProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    description: ''
  });

  const [celebration, setCelebration] = useState<CelebrationConfig>({
    show: false,
    message: '',
    subMessage: ''
  });

  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const count = tasks.filter(t => t.selected).length;
    setSelectedCount(count);
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      assignedTo: parseInt(newTask.assignedTo),
      priority: newTask.priority as Task['priority'],
      dueDate: newTask.dueDate,
      description: newTask.description,
      status: 'pending',
      createdAt: new Date(),
      assignedDate: new Date(),
      selected: false
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      description: ''
    });

    const memberName = teamMembers.find(m => m.id === parseInt(newTask.assignedTo))?.name;
    addNotification(`Task "${task.title}" assigned to ${memberName}`, 'success');
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const oldStatus = task.status;
        if (newStatus === 'completed' && oldStatus !== 'completed') {
          const memberName = teamMembers.find(m => m.id === task.assignedTo)?.name;
          addNotification(`🎉 Task "${task.title}" completed by ${memberName}!`, 'success');
          triggerCelebration(memberName || 'Team member', task.title);
        }
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const triggerCelebration = (memberName: string, taskTitle: string) => {
    setCelebration({
      show: true,
      message: '🎉 Awesome Work! 🎉',
      subMessage: `${memberName} completed: "${taskTitle}"`
    });

    setTimeout(() => {
      setCelebration({ show: false, message: '', subMessage: '' });
    }, 3000);
  };

  const toggleTaskSelection = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, selected: !task.selected } : task
    ));
  };

  const toggleAllTasks = () => {
    const allSelected = tasks.every(t => t.selected);
    setTasks(tasks.map(task => ({ ...task, selected: !allSelected })));
  };

  const updateBulkStatus = (newStatus: Task['status']) => {
    const selectedTasks = tasks.filter(t => t.selected);
    if (selectedTasks.length === 0) {
      addNotification('Please select tasks to update', 'warning');
      return;
    }

    setTasks(tasks.map(task => {
      if (task.selected) {
        const oldStatus = task.status;
        if (newStatus === 'completed' && oldStatus !== 'completed') {
          const memberName = teamMembers.find(m => m.id === task.assignedTo)?.name;
          addNotification(`🎉 Task "${task.title}" completed by ${memberName}!`, 'success');
        }
        return { ...task, status: newStatus, selected: false };
      }
      return task;
    }));

    addNotification(`Updated status of ${selectedTasks.length} tasks to ${newStatus}`, 'success');
  };

  const assignBulkTasks = (memberId: number) => {
    const selectedTasks = tasks.filter(t => t.selected);
    if (selectedTasks.length === 0) {
      addNotification('Please select tasks to assign', 'warning');
      return;
    }

    const memberName = teamMembers.find(m => m.id === memberId)?.name;
    setTasks(tasks.map(task => 
      task.selected ? { ...task, assignedTo: memberId, selected: false } : task
    ));

    addNotification(`Assigned ${selectedTasks.length} tasks to ${memberName}`, 'success');
  };

  const deleteBulkTasks = () => {
    const selectedTasks = tasks.filter(t => t.selected);
    if (selectedTasks.length === 0) {
      addNotification('Please select tasks to delete', 'warning');
      return;
    }

    setTasks(tasks.filter(t => !t.selected));
    addNotification(`Deleted ${selectedTasks.length} tasks`, 'warning');
  };

  const deleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTasks(tasks.filter(t => t.id !== taskId));
      addNotification(`Task "${task.title}" has been deleted`, 'warning');
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Task Title</label>
          <input
            type="text"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="e.g., Create Instagram campaign"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Assign To</label>
          <select
            value={newTask.assignedTo}
            onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select team member</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Priority</label>
          <select
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Due Date</label>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <label className="block font-semibold text-gray-700">Description</label>
          <textarea
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            rows={3}
            placeholder="Task details and requirements..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Active Tasks</h3>
          
          {tasks.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAllTasks}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                {tasks.every(t => t.selected) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                Select All
              </button>
              
              {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    onChange={e => updateBulkStatus(e.target.value as Task['status'])}
                    className="px-3 py-1 rounded-lg border border-gray-300"
                  >
                    <option value="">Update Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <select
                    onChange={e => assignBulkTasks(Number(e.target.value))}
                    className="px-3 py-1 rounded-lg border border-gray-300"
                  >
                    <option value="">Assign To</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={deleteBulkTasks}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add your first task above!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => {
              const member = teamMembers.find(m => m.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-xl p-6 shadow-md border transition-all ${
                    task.selected ? 'border-indigo-500 shadow-lg' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => toggleTaskSelection(task.id)}
                      className="text-gray-400 hover:text-indigo-500"
                    >
                      {task.selected ? (
                        <CheckSquare className="w-6 h-6" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">{task.title}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className={`
                            px-3 py-1 rounded-full text-sm font-semibold
                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            {task.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Assigned to</p>
                          <p className="font-semibold">{member?.name || 'Unassigned'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Priority</p>
                          <p className="font-semibold uppercase">{task.priority}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Due Date</p>
                          <p className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-semibold">{task.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{task.description}</p>

                      <div className="flex items-center gap-4">
                        <select
                          value={task.status}
                          onChange={e => updateTaskStatus(task.id, e.target.value as Task['status'])}
                          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {celebration.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-12 py-8 rounded-2xl text-center animate-bounce">
            <h3 className="text-3xl font-bold mb-2">{celebration.message}</h3>
            {celebration.subMessage && (
              <p className="text-lg opacity-90">{celebration.subMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksTab