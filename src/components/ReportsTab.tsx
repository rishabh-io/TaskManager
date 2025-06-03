import { useState } from 'react';
import { Task, TeamMember } from '../types';
import { FileText } from 'lucide-react';

interface ReportsTabProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  addNotification: (message: string, type: string) => void;
}

export default function ReportsTab({ tasks, teamMembers, addNotification }: ReportsTabProps) {
  const [reportPeriod, setReportPeriod] = useState('week');
  const [selectedMember, setSelectedMember] = useState('all');

  const generateReport = () => {
    // In a real application, we would generate a PDF here
    // For now, we'll just show a notification
    addNotification('Performance report generated and downloaded!', 'success');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Performance Reports</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-4">Generate Report</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Report Period</label>
            <select
              value={reportPeriod}
              onChange={e => setReportPeriod(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Team Member</label>
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Team Members</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateReport}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <FileText className="w-5 h-5" />
          Generate PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <h4 className="text-lg font-bold text-green-800 mb-2">Completed Tasks</h4>
          <p className="text-4xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
          <p className="text-green-600 mt-1">Total completed tasks</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
          <h4 className="text-lg font-bold text-orange-800 mb-2">In Progress</h4>
          <p className="text-4xl font-bold text-orange-600">
            {tasks.filter(t => t.status === 'in-progress').length}
          </p>
          <p className="text-orange-600 mt-1">Tasks currently in progress</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
          <h4 className="text-lg font-bold text-red-800 mb-2">Pending Tasks</h4>
          <p className="text-4xl font-bold text-red-600">
            {tasks.filter(t => t.status === 'pending').length}
          </p>
          <p className="text-red-600 mt-1">Tasks waiting to be started</p>
        </div>
      </div>
    </div>
  );
}