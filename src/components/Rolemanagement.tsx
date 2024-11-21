import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role, RoleUpdateData } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/hono';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const RoleManagement: React.FC = () => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: api.roles.getAll,
    select: (data) => data || []
  });

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: api.permissions.getAll
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.roles.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role created successfully");
    },
    onError: () => {
      toast.error("Failed to create role");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleUpdateData }) => 
      api.roles.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setEditingRole(null);
      setSelectedPermissions([]);
      toast.success("Role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update role");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.roles.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete role");
    }
  });

  React.useEffect(() => {
    if (editingRole) {
      setSelectedPermissions(editingRole.permissions.map(p => p.id));
    }
  }, [editingRole]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingRole) {
      const formData = new FormData(e.currentTarget);
      updateMutation.mutate({
        id: editingRole.id,
        data: {
          name: formData.get('name') as string,
          permissions: selectedPermissions
        }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {roles.map((role: Role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.permissions.map((p: { name: string }) => p.name).join(', ')}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  className="mr-2" 
                  onClick={() => setEditingRole(role)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(role.id)}
                >
                  Delete
                </Button>
              </TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingRole} onOpenChange={(open) => {
        if (!open) {
          setEditingRole(null);
          setSelectedPermissions([]);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name"
                  defaultValue={editingRole?.name}
                  placeholder="Role name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Permissions</label>
                <Select
                  onValueChange={(value) => {
                    if (!selectedPermissions.includes(value)) {
                      setSelectedPermissions([...selectedPermissions, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissions.map((permission) => (
                      <SelectItem 
                        key={permission.id} 
                        value={permission.id}
                      >
                        {permission.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPermissions.map((permId) => {
                    const permission = permissions.find(p => p.id === permId);
                    return (
                      <div 
                        key={permId}
                        className="bg-secondary px-2 py-1 rounded-md flex items-center gap-2"
                      >
                        <span>{permission?.name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedPermissions(
                            selectedPermissions.filter(id => id !== permId)
                          )}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

