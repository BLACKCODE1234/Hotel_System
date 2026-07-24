import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Shield, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX, 
  Crown, 
  ArrowLeft,
  MoreVertical,
  Settings,
  Mail,
  Phone,
  Calendar,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  employeeId?: string;
  department?: string;
  position?: string;
}

interface AdminFromApi {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  lastLogin: string | null;
  status: string;
}

const SuperAdminManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const response = await api.listAdmins();
        if (response.ok) {
          const data: AdminFromApi[] = await response.json();
          setUsers(data.map((admin) => {
            const nameParts = admin.name.split(' ');
            return {
              id: admin.id,
              email: admin.email,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              role: 'admin' as const,
              isActive: admin.status === 'active',
              createdAt: '',
              lastLogin: admin.lastLogin || undefined,
              department: '',
              position: '',
            };
          }));
        }
      } catch {
        // fallback silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'status-chip status-chip--warn';
      case 'admin': return 'status-chip status-chip--neutral';
      case 'user': return 'status-chip status-chip--ok';
      default: return 'status-chip status-chip--neutral';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole as 'user' | 'admin' | 'superadmin' } : user
      )
    );
  };

  const handleStatusToggle = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    setActionError('');
    try {
      const response = await api.deleteAdmin(email);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail?.message || data?.message || 'Failed to delete user');
      }
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ops-shell">
      {/* Header */}
      <div className="ops-topbar text-white px-4 py-4 ">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link 
              to="/admin"
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm text-white font-medium rounded-sm hover:bg-white/30 transition-all duration-200 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brass rounded-sm flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
                <p className="text-white/70 text-sm">Manage all system users and their permissions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <Link
              to="/superadmin"
              className="btn-primary text-sm py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Super Admin Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-brass" />
              <span className="font-medium">Super Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-muted">Total Users</p>
                <p className="text-2xl font-bold text-ink">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-brass" />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-muted">Super Admins</p>
                <p className="text-2xl font-bold text-ink">
                  {users.filter(u => u.role === 'superadmin').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                <Crown className="w-6 h-6 text-brass" />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-muted">Administrators</p>
                <p className="text-2xl font-bold text-ink">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-brass" />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-muted">Active Users</p>
                <p className="text-2xl font-bold text-ink">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-forest" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="lg:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
              >
                <option value="all">All Roles</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Administrator</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{actionError}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="panel overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-sand-deep">
            <h3 className="text-lg font-semibold text-ink">
              Users ({filteredUsers.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="h-8 w-8 border-2 border-sand-deep border-t-brass rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-ink-muted">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-ink-muted mx-auto mb-4" />
              <p className="text-ink-muted">No users found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand-warm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sand-deep">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-sand-warm">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-brass rounded-sm flex items-center justify-center text-white font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-ink">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-ink-muted flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            {user.department && (
                              <div className="text-xs text-ink-muted">
                                {user.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`${getRoleColor(user.role)}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`${
                            user.isActive
                              ? 'status-chip status-chip--ok'
                              : 'status-chip status-chip--danger'
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {formatDate(user.lastLogin)}
                          </div>
                        ) : (
                          <span className="text-ink-muted">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-brass hover:text-brass-deep p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white panel shadow-none max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-sand-deep">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-ink-muted hover:text-ink-muted"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brass rounded-sm flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-ink">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-ink-muted">{selectedUser.position || 'User'}</p>
                  <div className={`${getRoleColor(selectedUser.role)} mt-2`}>
                    {getRoleIcon(selectedUser.role)}
                    <span className="ml-1 capitalize">{selectedUser.role}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-ink mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-ink-muted" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-ink-muted" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-ink mb-3">Account Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-ink-muted" />
                      <span>Created: {formatDate(selectedUser.createdAt)}</span>
                    </div>
                    {selectedUser.lastLogin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-ink-muted" />
                        <span>Last Login: {formatDate(selectedUser.lastLogin)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedUser.department || selectedUser.position) && (
                  <div className="md:col-span-2">
                    <h5 className="font-medium text-ink mb-3">Additional Information</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {selectedUser.department && (
                        <div>
                          <span className="text-ink-muted">Department:</span>
                          <p className="font-medium">{selectedUser.department}</p>
                        </div>
                      )}
                      {selectedUser.position && (
                        <div>
                          <span className="text-ink-muted">Position:</span>
                          <p className="font-medium">{selectedUser.position}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white panel shadow-none max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F8EDEA] border border-[#E8C9C3] rounded-sm flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">Delete User</h3>
                  <p className="text-ink-muted">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-ink-muted mb-6">
                Are you sure you want to delete <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>? 
                This will permanently remove their account and all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-sand-deep text-ink-soft rounded-sm hover:bg-sand-warm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id, selectedUser.email)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminManagementPage;
