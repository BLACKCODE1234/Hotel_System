import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Home, 
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Briefcase,
  ClipboardList,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Wrench,
  Coffee,
  Bed
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  dueTime: string;
  room?: string;
  department: string;
}

const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Clean Room 205',
      description: 'Guest checkout - full cleaning required',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Maria Garcia',
      dueTime: '10:30 AM',
      room: '205',
      department: 'Housekeeping'
    },
    {
      id: '2',
      title: 'Fix AC Unit',
      description: 'Room 301 - AC not cooling properly',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'John Smith',
      dueTime: '2:00 PM',
      room: '301',
      department: 'Maintenance'
    },
    {
      id: '3',
      title: 'Restock Minibar',
      description: 'Presidential Suite - guest request',
      priority: 'low',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      dueTime: '9:00 AM',
      room: 'PS-1',
      department: 'Housekeeping'
    }
  ]);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Staff Dashboard</h1>
                <p className="text-green-100 text-sm">Hotel Operations Center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-1 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
                { id: 'rooms', label: 'Room Status', icon: Bed },
                { id: 'schedule', label: 'Schedule', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-orange-600">Due today</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-green-600">Great progress!</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Shift Hours</p>
                    <p className="text-2xl font-bold text-gray-900">6.5</p>
                    <p className="text-sm text-blue-600">of 8 hours</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-lg font-bold text-gray-900">Housekeeping</p>
                    <p className="text-sm text-gray-600">Floor 2-3</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.room ? `Room ${task.room}` : task.department}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-sm text-gray-500">{task.dueTime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {task.room && (
                            <span className="text-sm text-blue-600 font-medium">Room {task.room}</span>
                          )}
                          <span className="text-sm text-gray-500">Due: {task.dueTime}</span>
                          <span className="text-sm text-gray-500">{task.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {task.status !== 'completed' && (
                        <>
                          {task.status === 'pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in-progress')}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Start Task
                            </button>
                          )}
                          {task.status === 'in-progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Mark Complete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Room Status Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status - Floor 2</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { room: '201', status: 'clean', guest: 'Occupied' },
                  { room: '202', status: 'dirty', guest: 'Checkout' },
                  { room: '203', status: 'maintenance', guest: 'OOO' },
                  { room: '204', status: 'clean', guest: 'Available' },
                  { room: '205', status: 'cleaning', guest: 'Checkout' },
                  { room: '206', status: 'clean', guest: 'Occupied' }
                ].map((room) => (
                  <div key={room.room} className={`p-4 rounded-lg border-2 ${
                    room.status === 'clean' ? 'border-green-200 bg-green-50' :
                    room.status === 'dirty' ? 'border-red-200 bg-red-50' :
                    room.status === 'cleaning' ? 'border-blue-200 bg-blue-50' :
                    'border-orange-200 bg-orange-50'
                  }`}>
                    <div className="text-center">
                      <p className="font-bold text-lg">{room.room}</p>
                      <p className="text-sm text-gray-600">{room.guest}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        room.status === 'clean' ? 'bg-green-100 text-green-800' :
                        room.status === 'dirty' ? 'bg-red-100 text-red-800' :
                        room.status === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Schedule</h3>
              <div className="space-y-4">
                {[
                  { day: 'Monday', date: 'Nov 11', shift: '8:00 AM - 4:00 PM', status: 'completed' },
                  { day: 'Tuesday', date: 'Nov 12', shift: '8:00 AM - 4:00 PM', status: 'completed' },
                  { day: 'Wednesday', date: 'Nov 13', shift: '8:00 AM - 4:00 PM', status: 'current' },
                  { day: 'Thursday', date: 'Nov 14', shift: '8:00 AM - 4:00 PM', status: 'upcoming' },
                  { day: 'Friday', date: 'Nov 15', shift: '8:00 AM - 4:00 PM', status: 'upcoming' }
                ].map((schedule, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                    schedule.status === 'current' ? 'border-blue-200 bg-blue-50' :
                    schedule.status === 'completed' ? 'border-green-200 bg-green-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div>
                      <p className="font-medium text-gray-900">{schedule.day}</p>
                      <p className="text-sm text-gray-600">{schedule.date}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{schedule.shift}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        schedule.status === 'current' ? 'bg-blue-100 text-blue-800' :
                        schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
