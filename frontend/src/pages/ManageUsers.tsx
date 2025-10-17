import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  createdAt: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = filterRole ? `?role=${filterRole}` : '';
      const response = await axios.get(`${API_BASE_URL}/admin/users${params}`);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'purple';
      case 'police': return 'blue';
      case 'ngo': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'red';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage system users and their roles
            </p>
          </div>
          <Button size="sm" icon={PlusIcon}>
            Add User
          </Button>
        </div>

        <Card>
          <div className="flex gap-4 mb-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="police">Police</option>
              <option value="ngo">NGO</option>
              <option value="user">User</option>
            </select>
          </div>

          <Title>Users ({users.length})</Title>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Phone</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge color={getRoleColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="xs" variant="secondary" icon={PencilIcon}>
                          Edit
                        </Button>
                        <Button 
                          size="xs" 
                          variant="secondary" 
                          color="red" 
                          icon={TrashIcon}
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;