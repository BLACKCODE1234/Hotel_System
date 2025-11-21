import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
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

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
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

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [dailyChecklist, setDailyChecklist] = useState<ChecklistItem[]>([
    { id: 'uniform', label: 'Uniform & appearance check', completed: false },
    { id: 'equipment', label: 'Cleaning equipment prepared', completed: false },
    { id: 'briefing', label: 'Attended team briefing', completed: false }
  ]);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const toggleChecklistItem = (id: string) => {
    setDailyChecklist(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
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

  const formatLabel = (value: string) => {
    return value.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Staff Workspace</p>
              <h1 className="text-2xl font-semibold text-gray-900">Housekeeping Operations</h1>
              <p className="text-xs text-gray-500 mt-1">Monitor today&apos;s tasks, room status, and schedule in one place.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 self-end sm:self-auto">
            <div className="hidden md:flex flex-col items-end text-xs text-gray-500">
              <span className="font-medium text-gray-900">Today</span>
              <span>Shift: 8:00 AM - 4:00 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] leading-none font-semibold">
                  3
                </span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                    S
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-semibold leading-tight text-gray-900">Staff Member</span>
                    <span className="text-xs text-gray-500 leading-tight">Housekeeping - Floor 2-3</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold">Staff Member</p>
                      <p className="text-xs text-gray-500">Housekeeping - Floor 2-3</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'schedule', label: 'My Day', icon: Clock },
                { id: 'rooms', label: 'Attendance & Compliance', icon: ClipboardList },
                { id: 'tasks', label: 'Tasks & Activity', icon: CheckSquare },
                { id: 'profile', label: 'Requests & Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-sky-600 text-white shadow-md'
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
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 hover:shadow-md hover:border-blue-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Report an issue</p>
                  <p className="text-xs text-gray-500">Notify maintenance or supervisor</p>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 hover:shadow-md hover:border-green-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Request maintenance</p>
                  <p className="text-xs text-gray-500">Log equipment or room issues</p>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 hover:shadow-md hover:border-amber-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Take a break</p>
                  <p className="text-xs text-gray-500">Coordinate your break schedule</p>
                </div>
              </button>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                      {formatLabel(task.priority)}
                    </span>
                    <span className="text-sm text-gray-500">{task.dueTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements / Notices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements / Notices</h3>
              <div className="space-y-3">
                {[
                  { title: 'New housekeeping SOP update', date: 'Nov 10', category: 'Policy' },
                  { title: 'Fire drill scheduled for Friday 3 PM', date: 'Nov 12', category: 'Safety' },
                  { title: 'Staff appreciation event next week', date: 'Nov 18', category: 'HR' }
                ].map((announcement, index) => (
                  <div key={index} className="flex items-start justify-between border border-gray-100 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                      <p className="text-xs text-gray-500">{announcement.date}</p>
                    </div>
                    <span className="ml-3 inline-flex px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                      {announcement.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks & Activity Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks &amp; Assignments</h3>
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
                          {formatLabel(task.priority)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {formatLabel(task.status)}
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { action: 'Clocked in for morning shift', time: 'Today · 7:58 AM', meta: 'Shift 8:00 AM - 4:00 PM' },
                  { action: 'Completed task "Clean Room 205"', time: 'Today · 9:45 AM', meta: 'Housekeeping' },
                  { action: 'Requested maintenance for Room 301', time: 'Yesterday · 3:10 PM', meta: 'Maintenance' },
                  { action: 'Marked training "Fire Safety" as completed', time: 'Last week', meta: 'Compliance' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-start justify-between border border-gray-100 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-medium text-gray-900">{entry.action}</p>
                      <p className="text-xs text-gray-500">{entry.time}</p>
                    </div>
                    <span className="ml-3 text-xs text-gray-500">{entry.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attendance & Compliance Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Summary</h3>
                <p className="text-sm text-gray-600 mb-4">This month</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold text-gray-900">On-time shifts:</span> 18</p>
                  <p><span className="font-semibold text-gray-900">Late arrivals:</span> 2</p>
                  <p><span className="font-semibold text-gray-900">Absences:</span> 1</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance &amp; Training</h3>
                <p className="text-sm text-gray-600 mb-4">Your required trainings</p>
                <div className="space-y-3">
                  {[
                    { title: 'Fire Safety Basics', status: 'Completed', statusColor: 'bg-green-100 text-green-800' },
                    { title: 'Guest Privacy & Data Protection', status: 'Due soon', statusColor: 'bg-yellow-100 text-yellow-800' },
                    { title: 'Workplace Safety Refresher', status: 'Overdue', statusColor: 'bg-red-100 text-red-800' }
                  ].map((training, index) => (
                    <div key={index} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{training.title}</p>
                        <p className="text-xs text-gray-500">Housekeeping · Annual</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${training.statusColor}`}>
                        {training.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Compliance Actions</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Complete "Workplace Safety Refresher" by Nov 20.</li>
                <li>Review and sign the updated Housekeeping policies document.</li>
              </ul>
            </div>
          </div>
        )}

        {/* My Day Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shift Details</h3>
                <p className="text-sm text-gray-600 mb-4">Today · 8:00 AM - 4:00 PM</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>Department: Housekeeping</p>
                  <p>Location: Floors 2-3</p>
                  <p>Break: 30 minutes</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clock In / Clock Out</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isClockedIn ? 'You are currently clocked in.' : 'You are currently clocked out.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsClockedIn(!isClockedIn)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
                <p className="mt-3 text-xs text-gray-500">
                  This is a demo control. Integration with a real time-tracking system can be added later.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Schedule</h3>
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
                          {formatLabel(schedule.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Checklist</h3>
                <div className="space-y-2">
                  {dailyChecklist.map(item => (
                    <label key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                      />
                      <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests & Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requests</h3>
                <p className="text-sm text-gray-600 mb-4">Submit requests to your supervisor.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Request Time Off
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Request Shift Swap
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  These actions can be connected to your HR or scheduling system later.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Profile</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Staff Member</p>
                    <p className="text-sm text-gray-600">Housekeeping · Floor 2-3</p>
                    <p className="text-xs text-gray-500">Employee ID: HK-1024</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>Email: staff@example.com</p>
                  <p>Phone: +1 (555) 000-1234</p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  <span>View full profile</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

export default StaffDashboard;
