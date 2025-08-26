'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  FileText, 
  Filter,
  ChevronDown,
  ChevronRight,
  Activity,
  LogIn,
  Edit,
  Trash,
  Upload,
  Settings,
  UserPlus,
  Search,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  oldValue?: any;
  newValue?: any;
  changes?: any;
  metadata?: any;
}

// Action type configuration
const ACTION_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  USER_LOGIN: { label: 'Login', icon: LogIn, color: 'text-blue-600 bg-blue-50' },
  USER_LOGOUT: { label: 'Logout', icon: LogIn, color: 'text-gray-600 bg-gray-50' },
  USER_CREATED: { label: 'User Created', icon: UserPlus, color: 'text-green-600 bg-green-50' },
  MENU_CREATE: { label: 'Menu Created', icon: FileText, color: 'text-green-600 bg-green-50' },
  MENU_UPDATE: { label: 'Menu Updated', icon: Edit, color: 'text-yellow-600 bg-yellow-50' },
  MENU_DELETE: { label: 'Menu Deleted', icon: Trash, color: 'text-red-600 bg-red-50' },
  HOURS_UPDATE: { label: 'Hours Updated', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  CONTACT_UPDATE: { label: 'Contact Updated', icon: Edit, color: 'text-yellow-600 bg-yellow-50' },
  MEDIA_UPLOAD: { label: 'Media Uploaded', icon: Upload, color: 'text-purple-600 bg-purple-50' },
  MEDIA_DELETE: { label: 'Media Deleted', icon: Trash, color: 'text-red-600 bg-red-50' },
  SETTINGS_UPDATE: { label: 'Settings Updated', icon: Settings, color: 'text-indigo-600 bg-indigo-50' },
  SYSTEM_INIT: { label: 'System Init', icon: Activity, color: 'text-gray-600 bg-gray-50' },
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Filters
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadAuditLogs();
  }, [selectedAction, selectedUser, selectedDateRange]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedAction) params.append('action', selectedAction);
      if (selectedUser) params.append('userId', selectedUser);
      
      // Date range filter
      if (selectedDateRange && selectedDateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (selectedDateRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = new Date(0);
        }
        
        params.append('startDate', startDate.toISOString());
      }

      const response = await fetch(`/api/admin/audit?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setLogs(result.data);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (logId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getActionConfig = (action: string) => {
    return ACTION_CONFIG[action] || { 
      label: action, 
      icon: Activity, 
      color: 'text-gray-600 bg-gray-50' 
    };
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.description.toLowerCase().includes(query) ||
      log.userName.toLowerCase().includes(query) ||
      log.userEmail.toLowerCase().includes(query) ||
      log.entityType.toLowerCase().includes(query)
    );
  });

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(new Set(logs.map(log => log.userId))).map(userId => {
    const log = logs.find(l => l.userId === userId);
    return { id: userId, name: log?.userName || userId, email: log?.userEmail || '' };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track all changes and user activity</p>
        </div>
        <button
          onClick={loadAuditLogs}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date Range */}
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          {/* Action Type */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Actions</option>
            {Object.entries(ACTION_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* User Filter */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No audit logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => {
                  const actionConfig = getActionConfig(log.action);
                  const Icon = actionConfig.icon;
                  const isExpanded = expandedRows.has(log.id);
                  const hasDetails = log.oldValue || log.newValue || log.changes || log.metadata;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {log.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {log.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionConfig.color}`}>
                            <Icon className="w-3 h-3" />
                            {actionConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.description}
                          <div className="text-xs text-gray-500 mt-1">
                            {log.entityType} • {log.entityId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasDetails && (
                            <button
                              onClick={() => toggleRowExpansion(log.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              Details
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && hasDetails && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-3">
                              {log.changes && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Changes</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <pre className="text-xs text-gray-600 overflow-x-auto">
                                      {JSON.stringify(log.changes, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {log.oldValue && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Value</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <pre className="text-xs text-gray-600 overflow-x-auto">
                                      {JSON.stringify(log.oldValue, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {log.newValue && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Value</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <pre className="text-xs text-gray-600 overflow-x-auto">
                                      {JSON.stringify(log.newValue, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {log.metadata && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Info</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <pre className="text-xs text-gray-600 overflow-x-auto">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {log.ipAddress && (
                                <div className="text-xs text-gray-500">
                                  IP: {log.ipAddress} • User Agent: {log.userAgent?.substring(0, 50)}...
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Logins</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.filter(log => log.action === 'USER_LOGIN').length}
              </p>
            </div>
            <LogIn className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Changes Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.filter(log => {
                  const today = new Date();
                  const logDate = new Date(log.timestamp);
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}