'use client'
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/hono';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";

interface PermissionForm {
  name: string;
  description?: string;
}

export const PermissionManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<PermissionForm>();

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: api.permissions.getAll
  });

  const createMutation = useMutation({
    mutationFn: (data: PermissionForm) => api.permissions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      reset();
      toast.success("Permission created successfully");
    },
    onError: () => {
      toast.error("Failed to create permission");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.permissions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success("Permission deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete permission");
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Permission Management</h1>
      
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input {...register('name')} placeholder="Permission name" />
          <Input {...register('description')} placeholder="Description" />
          <Button type="submit">Add Permission</Button>
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(permission.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};