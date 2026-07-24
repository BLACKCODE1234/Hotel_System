import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
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
  MessageCircle,
  Phone,
  Video
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

interface StaffContact {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'away' | 'offline';
}

interface ScheduleItem {
  id: string;
  day: string;
  date: string;
  shift: string;
  status: string;
}

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [dailyChecklist, setDailyChecklist] = useState<ChecklistItem[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [dataError, setDataError] = useState('');

  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const staffDirectory: StaffContact[] = [
    { id: 's1', name: 'Maria Garcia', role: 'Housekeeper', department: 'Housekeeping', status: 'online' },
    { id: 's2', name: 'John Smith', role: 'Maintenance Technician', department: 'Maintenance', status: 'away' },
    { id: 's3', name: 'Sarah Johnson', role: 'Senior Housekeeper', department: 'Housekeeping', status: 'online' },
    { id: 's4', name: 'Ahmed Ali', role: 'Front Desk', department: 'Guest Services', status: 'offline' },
    { id: 's5', name: 'Emily Chen', role: 'Supervisor', department: 'Housekeeping', status: 'online' }
  ];

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    setDataError('');
    try {
      const [tasksResponse, checklistResponse, clockResponse, scheduleResponse] = await Promise.all([
        api.getStaffTasks(),
        api.getStaffChecklist(),
        api.getStaffClockStatus(),
        api.getStaffSchedule(),
      ]);

      if (!tasksResponse.ok || !checklistResponse.ok || !clockResponse.ok || !scheduleResponse.ok) {
        throw new Error('Failed to load staff data');
      }

      const [tasksData, checklistData, clockData, scheduleData] = await Promise.all([
        tasksResponse.json(),
        checklistResponse.json(),
        clockResponse.json(),
        scheduleResponse.json(),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData.map((task: any) => ({ ...task, id: String(task.id) })) : []);
      setDailyChecklist(
        Array.isArray(checklistData) ? checklistData.map((item: any) => ({ ...item, id: String(item.id) })) : [],
      );
      setIsClockedIn(Boolean(clockData.isClockedIn));
      setScheduleItems(
        Array.isArray(scheduleData) ? scheduleData.map((item: any) => ({ ...item, id: String(item.id) })) : [],
      );
    } catch (error) {
      setDataError('Unable to load live staff data. Please check the backend connection.');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    const response = await api.updateTaskStatus(Number(taskId), newStatus);
    if (response.ok) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } else {
      alert('Failed to update task status');
    }
  };

  const toggleChecklistItem = async (id: string) => {
    const item = dailyChecklist.find((checklistItem) => checklistItem.id === id);
    if (!item) return;

    const nextCompleted = !item.completed;
    const response = await api.toggleChecklistItem(Number(id), nextCompleted);
    if (response.ok) {
      setDailyChecklist(prevItems =>
        prevItems.map(checklistItem =>
          checklistItem.id === id ? { ...checklistItem, completed: nextCompleted } : checklistItem
        )
      );
    } else {
      alert('Failed to update checklist item');
    }
  };

  const toggleClockStatus = async () => {
    const response = isClockedIn ? await api.staffClockOut() : await api.staffClockIn();
    if (response.ok) {
      setIsClockedIn(!isClockedIn);
    } else {
      alert('Failed to update clock status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'status-chip status-chip--danger border-red-200';
      case 'medium': return 'status-chip status-chip--warn border-yellow-200';
      case 'low': return 'status-chip status-chip--ok';
      default: return 'status-chip status-chip--neutral border-sand-deep';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-chip status-chip--ok';
      case 'in-progress': return 'status-chip status-chip--neutral';
      case 'pending': return 'status-chip status-chip--warn';
      default: return 'status-chip status-chip--neutral';
    }
  };

  const formatLabel = (value: string) => {
    return value.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPresenceColor = (status: StaffContact['status']) => {
    switch (status) {
      case 'online':
        return 'status-chip status-chip--ok';
      case 'away':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'status-chip status-chip--neutral';
    }
  };

  const filteredStaff = staffDirectory.filter((staff) => {
    if (!staffSearchTerm.trim()) return true;
    const term = staffSearchTerm.toLowerCase();
    return (
      staff.name.toLowerCase().includes(term) ||
      staff.department.toLowerCase().includes(term) ||
      staff.role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="ops-shell">
      {/* Header */}
      <div className="bg-white border-b border-sand-deep">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center ">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-forest">Staff Workspace</p>
              <h1 className="text-2xl font-semibold text-ink">Housekeeping Operations</h1>
              <p className="text-xs text-ink-muted mt-1">Monitor today&apos;s tasks, room status, and schedule in one place.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 self-end sm:self-auto">
            <div className="hidden md:flex flex-col items-end text-xs text-ink-muted">
              <span className="font-medium text-ink">Today</span>
              <span>Shift: 8:00 AM - 4:00 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-sand-deep text-ink-muted hover:text-ink hover:border-sand-deep hover:bg-sand-warm transition-colors"
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
                  className="flex items-center gap-2 rounded-full border border-sand-deep px-2 py-1.5 hover:bg-sand-warm hover:border-sand-deep transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-sm font-semibold">
                    S
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-semibold leading-tight text-ink">Staff Member</span>
                    <span className="text-xs text-ink-muted leading-tight">Housekeeping - Floor 2-3</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-ink-muted" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-ink rounded-xl  border border-sand-deep z-20">
                    <div className="px-4 py-3 border-b border-sand-deep">
                      <p className="text-sm font-semibold">Staff Member</p>
                      <p className="text-xs text-ink-muted">Housekeeping - Floor 2-3</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-sand-warm"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-sand-warm"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      <div className="border-t border-sand-deep my-1" />
                      <button
                        onClick={async () => {
                          setShowProfileDropdown(false);
                          await api.logout();
                          navigate('/login');
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataError && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {dataError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="panel p-2">
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-sm font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-ink text-white '
                      : 'text-ink-muted hover:text-ink hover:bg-sand-warm'
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
              <div className="bg-white rounded-xl  p-6 border border-sand-deep">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Pending Tasks</p>
                    <p className="text-2xl font-bold text-ink">{tasks.filter(task => task.status !== 'completed').length}</p>
                    <p className="text-sm text-orange-600">Open tasks</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Completed Today</p>
                    <p className="text-2xl font-bold text-ink">{tasks.filter(task => task.status === 'completed').length}</p>
                    <p className="text-sm text-forest">From backend tasks</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Shift Hours</p>
                    <p className="text-2xl font-bold text-ink">{isClockedIn ? 'Active' : 'Off'}</p>
                    <p className="text-sm text-brass">Clock status</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Clock className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Department</p>
                    <p className="text-lg font-bold text-ink">Housekeeping</p>
                    <p className="text-sm text-ink-muted">Floor 2-3</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl  border border-sand-deep px-4 py-3 hover: hover:border-blue-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-sm bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Report an issue</p>
                  <p className="text-xs text-ink-muted">Notify maintenance or supervisor</p>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl  border border-sand-deep px-4 py-3 hover: hover:border-green-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-sm bg-green-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Request maintenance</p>
                  <p className="text-xs text-ink-muted">Log equipment or room issues</p>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 bg-white rounded-xl  border border-sand-deep px-4 py-3 hover: hover:border-amber-200 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-sm bg-amber-100 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Take a break</p>
                  <p className="text-xs text-ink-muted">Coordinate your break schedule</p>
                </div>
              </button>
            </div>

            {/* Recent Tasks */}
            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Recent Tasks</h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 border border-sand-deep rounded-sm">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-forest' :
                      task.status === 'in-progress' ? 'bg-ink' : 'bg-brass'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-ink">{task.title}</p>
                      <p className="text-sm text-ink-muted">{task.room ? `Room ${task.room}` : task.department}</p>
                    </div>
                    <span className={`status-chip ${getPriorityColor(task.priority)}`}>
                      {formatLabel(task.priority)}
                    </span>
                    <span className="text-sm text-ink-muted">{task.dueTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements / Notices */}
            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Announcements / Notices</h3>
              <div className="space-y-3">
                {[
                  { title: 'New housekeeping SOP update', date: 'Nov 10', category: 'Policy' },
                  { title: 'Fire drill scheduled for Friday 3 PM', date: 'Nov 12', category: 'Safety' },
                  { title: 'Staff appreciation event next week', date: 'Nov 18', category: 'HR' }
                ].map((announcement, index) => (
                  <div key={index} className="flex items-start justify-between border border-sand-deep rounded-sm px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{announcement.title}</p>
                      <p className="text-xs text-ink-muted">{announcement.date}</p>
                    </div>
                    <span className="ml-3 inline-flex status-chip status-chip status-chip--neutral">
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
            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Tasks &amp; Assignments</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-sand-deep rounded-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-ink">{task.title}</h4>
                        <p className="text-sm text-ink-muted mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {task.room && (
                            <span className="text-sm text-brass font-medium">Room {task.room}</span>
                          )}
                          <span className="text-sm text-ink-muted">Due: {task.dueTime}</span>
                          <span className="text-sm text-ink-muted">{task.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status-chip border ${getPriorityColor(task.priority)}`}>
                          {formatLabel(task.priority)}
                        </span>
                        <span className={`status-chip ${getStatusColor(task.status)}`}>
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
                              className="btn-primary text-xs py-1 px-3"
                            >
                              Start Task
                            </button>
                          )}
                          {task.status === 'in-progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="btn-accent text-xs py-1 px-3"
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

            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Activity Log</h3>
              <div className="space-y-3 text-sm text-ink-soft">
                {[
                  { action: 'Clocked in for morning shift', time: 'Today · 7:58 AM', meta: 'Shift 8:00 AM - 4:00 PM' },
                  { action: 'Completed task "Clean Room 205"', time: 'Today · 9:45 AM', meta: 'Housekeeping' },
                  { action: 'Requested maintenance for Room 301', time: 'Yesterday · 3:10 PM', meta: 'Maintenance' },
                  { action: 'Marked training "Fire Safety" as completed', time: 'Last week', meta: 'Compliance' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-start justify-between border border-sand-deep rounded-sm px-3 py-2">
                    <div>
                      <p className="font-medium text-ink">{entry.action}</p>
                      <p className="text-xs text-ink-muted">{entry.time}</p>
                    </div>
                    <span className="ml-3 text-xs text-ink-muted">{entry.meta}</span>
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
              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Attendance Summary</h3>
                <p className="text-sm text-ink-muted mb-4">This month</p>
                <div className="space-y-2 text-sm text-ink-soft">
                  <p><span className="font-semibold text-ink">On-time shifts:</span> 18</p>
                  <p><span className="font-semibold text-ink">Late arrivals:</span> 2</p>
                  <p><span className="font-semibold text-ink">Absences:</span> 1</p>
                </div>
              </div>

              <div className="panel p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-ink mb-2">Compliance &amp; Training</h3>
                <p className="text-sm text-ink-muted mb-4">Your required trainings</p>
                <div className="space-y-3">
                  {[
                    { title: 'Fire Safety Basics', status: 'Completed', statusColor: 'status-chip status-chip--ok' },
                    { title: 'Guest Privacy & Data Protection', status: 'Due soon', statusColor: 'status-chip status-chip--warn' },
                    { title: 'Workplace Safety Refresher', status: 'Overdue', statusColor: 'status-chip status-chip--danger' }
                  ].map((training, index) => (
                    <div key={index} className="flex items-center justify-between border border-sand-deep rounded-sm px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-ink">{training.title}</p>
                        <p className="text-xs text-ink-muted">Housekeeping · Annual</p>
                      </div>
                      <span className={`status-chip ${training.statusColor}`}>
                        {training.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Pending Compliance Actions</h3>
              <ul className="list-disc list-inside text-sm text-ink-soft space-y-1">
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
              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Shift Details</h3>
                <p className="text-sm text-ink-muted mb-4">Today · 8:00 AM - 4:00 PM</p>
                <div className="space-y-1 text-sm text-ink-soft">
                  <p>Department: Housekeeping</p>
                  <p>Location: Floors 2-3</p>
                  <p>Break: 30 minutes</p>
                </div>
              </div>

              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Clock In / Clock Out</h3>
                <p className="text-sm text-ink-muted mb-4">
                  {isClockedIn ? 'You are currently clocked in.' : 'You are currently clocked out.'}
                </p>
                <button
                  type="button"
                  onClick={toggleClockStatus}
                  className="px-4 py-2.5 rounded-sm text-sm font-medium text-white bg-forest hover:bg-forest-deep transition-colors"
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
                <p className="mt-3 text-xs text-ink-muted">Clock state is synced with the backend attendance record.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">My Schedule</h3>
                <div className="space-y-4">
                  {scheduleItems.map((schedule) => (
                    <div key={schedule.id} className={`flex items-center justify-between p-4 rounded-sm border ${
                      schedule.status === 'current' ? 'border-sand-deep bg-sand-warm' :
                      schedule.status === 'completed' ? 'border-accent-100 bg-accent-50' :
                      'border-sand-deep bg-sand-warm'
                    }`}>
                      <div>
                        <p className="font-medium text-ink">{schedule.day}</p>
                        <p className="text-sm text-ink-muted">{schedule.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-ink">{schedule.shift}</p>
                        <span className={`inline-block mt-1 status-chip ${
                          schedule.status === 'current' ? 'status-chip status-chip--neutral' :
                          schedule.status === 'completed' ? 'status-chip status-chip--ok' :
                          'status-chip status-chip--neutral'
                        }`}>
                          {formatLabel(schedule.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {scheduleItems.length === 0 && (
                    <p className="text-sm text-ink-muted">No schedule entries found.</p>
                  )}
                </div>
              </div>

              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">Daily Checklist</h3>
                <div className="space-y-2">
                  {dailyChecklist.map(item => (
                    <label key={item.id} className="flex items-center gap-3 text-sm text-ink-soft">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-4 w-4 text-forest border-sand-deep rounded"
                      />
                      <span className={item.completed ? 'line-through text-ink-muted' : ''}>{item.label}</span>
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
              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">Requests</h3>
                <p className="text-sm text-ink-muted mb-4">Submit requests to your supervisor.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-sm bg-forest text-white text-sm font-medium hover:bg-forest-deep transition-colors"
                  >
                    Request Time Off
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-sm border border-sand-deep text-sm font-medium text-ink-soft hover:bg-sand-warm transition-colors"
                  >
                    Request Shift Swap
                  </button>
                </div>
                <p className="mt-3 text-xs text-ink-muted">
                  These actions can be connected to your HR or scheduling system later.
                </p>
              </div>

              <div className="panel p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">My Profile</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center text-lg font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-medium text-ink">Staff Member</p>
                    <p className="text-sm text-ink-muted">Housekeeping · Floor 2-3</p>
                    <p className="text-xs text-ink-muted">Employee ID: HK-1024</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-ink-soft">
                  <p>Email: staff@example.com</p>
                  <p>Phone: +1 (555) 000-1234</p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-forest hover:text-emerald-800"
                >
                  <span>View full profile</span>
                </Link>
              </div>
            </div>

            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Contact Colleagues</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={staffSearchTerm}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                  placeholder="Search by name, department, or role"
                  className="w-full px-3 py-2 text-sm border border-sand-deep rounded-sm focus:outline-none focus:outline-none focus:border-brass"
                />
              </div>
              <div className="space-y-3">
                {filteredStaff.slice(0, 5).map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between border border-sand-deep rounded-sm px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-forest flex items-center justify-center text-sm font-semibold">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{staff.name}</p>
                        <p className="text-xs text-ink-muted">{staff.role} · {staff.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`status-chip ${getPresenceColor(staff.status)}`}>
                        {formatLabel(staff.status)}
                      </span>
                      <div className="hidden md:flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1.5 rounded-full border border-sand-deep text-ink-muted hover:bg-sand-warm"
                          title="Start chat"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-full border border-sand-deep text-ink-muted hover:bg-sand-warm"
                          title="Start audio call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-full border border-sand-deep text-ink-muted hover:bg-sand-warm"
                          title="Start video call"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStaff.length === 0 && (
                  <p className="text-sm text-ink-muted">No colleagues found. Try a different search.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
