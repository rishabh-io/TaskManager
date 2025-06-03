import { useState } from 'react';
import { TeamMember, Task } from '../types';
import { UserPlus, Trash2 } from 'lucide-react';

interface TeamTabProps {
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addNotification: (message: string, type: string) => void;
}

export default function TeamTab({
  teamMembers,
  setTeamMembers,
  tasks,
  setTasks,
  addNotification
}: TeamTabProps) {
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Content Creator',
    email: '',
    level: 'Junior'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.name || !newMember.email) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const member: TeamMember = {
      id: Date.now(),
      ...newMember,
      level: newMember.level as TeamMember['level']
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({
      name: '',
      role: 'Content Creator',
      email: '',
      level: 'Junior'
    });

    addNotification(`${member.name} has been added to the team!`, 'success');
  };

  const removeMember = (memberId: number) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      
      // Unassign tasks from removed member
      setTasks(tasks.map(task => 
        task.assignedTo === memberId ? { ...task, assignedTo: 0 } : task
      ));
      
      addNotification(`${member.name} has been removed from the team`, 'warning');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Team Management</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={newMember.name}
            onChange={e => setNewMember({ ...newMember, name: e.target.value })}
            placeholder="e.g., Sarah Johnson"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Role</label>
          <select
            value={newMember.role}
            onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Content Creator">Content Creator</option>
            <option value="Social Media Manager">Social Media Manager</option>
            <option value="SEO Specialist">SEO Specialist</option>
            <option value="PPC Specialist">PPC Specialist</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Marketing Analyst">Marketing Analyst</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={newMember.email}
            onChange={e => setNewMember({ ...newMember, email: e.target.value })}
            placeholder="sarah@company.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Experience Level</label>
          <select
            value={newMember.level}
            onChange={e => setNewMember({ ...newMember, level: e.target.value as TeamMember['level'] })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          Add Team Member
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Team Members</h3>
        
        {teamMembers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No team members yet. Add your first team member above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map(member => {
              const memberTasks = tasks.filter(t => t.assignedTo === member.id);
              const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
              const pendingTasks = memberTasks.filter(t => t.status === 'pending').length;
              const inProgressTasks = memberTasks.filter(t => t.status === 'in-progress').length;

              return (
                <div
                  key={member.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-500 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600">{member.email}</p>
                    <p className="text-gray-600">Experience: {member.level}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <p className="text-2xl font-bold text-orange-600">{inProgressTasks}</p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <p className="text-2xl font-bold text-red-600">{pendingTasks}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}