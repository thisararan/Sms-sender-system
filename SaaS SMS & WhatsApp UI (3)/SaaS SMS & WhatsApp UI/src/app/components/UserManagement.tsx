import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  status: 'Active' | 'Inactive';
  messagesUsed: number;
  messageLimit: number;
  joinedDate: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', messagesUsed: 2340, messageLimit: 10000, joinedDate: '2025-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager', status: 'Active', messagesUsed: 4567, messageLimit: 5000, joinedDate: '2025-02-10' },
    { id: '3', name: 'Bob Johnson', email: 'bob.j@example.com', role: 'User', status: 'Active', messagesUsed: 890, messageLimit: 2000, joinedDate: '2025-03-05' },
    { id: '4', name: 'Alice Williams', email: 'alice.w@example.com', role: 'User', status: 'Inactive', messagesUsed: 120, messageLimit: 2000, joinedDate: '2025-04-12' },
    { id: '5', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Manager', status: 'Active', messagesUsed: 3456, messageLimit: 5000, joinedDate: '2025-05-20' },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User' as const,
    messageLimit: '2000',
  });

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      messageLimit: parseInt(newUser.messageLimit),
      status: 'Active',
      messagesUsed: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'User', messageLimit: '2000' });
    setIsAddDialogOpen(false);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' as const : 'Active' as const }
        : user
    ));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-700',
      Manager: 'bg-purple-100 text-purple-700',
      User: 'bg-blue-100 text-blue-700',
    };
    return colors[role as keyof typeof colors];
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-limit">Message Limit</Label>
                <Input
                  id="message-limit"
                  type="number"
                  placeholder="2000"
                  value={newUser.messageLimit}
                  onChange={(e) => setNewUser({ ...newUser, messageLimit: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'bg-blue-100 text-blue-700', icon: UserCheck },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: 'bg-green-100 text-green-700', icon: UserCheck },
          { label: 'Inactive', value: users.filter(u => u.status === 'Inactive').length, color: 'bg-gray-100 text-gray-700', icon: UserX },
          { label: 'Admins', value: users.filter(u => u.role === 'Admin').length, color: 'bg-red-100 text-red-700', icon: UserCheck },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {user.messagesUsed.toLocaleString()} / {user.messageLimit.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${(user.messagesUsed / user.messageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.joinedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4 text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'Active' ? (
                            <UserX className="size-4 text-amber-600" />
                          ) : (
                            <UserCheck className="size-4 text-green-600" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
