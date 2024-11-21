'use client'
import { PermissionManagement } from '@/components/PermissionManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { ManagementSkeleton } from "@/components/skeletons";

export default function PermissionsPage() {
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: api.permissions.getAll
  });
  
  if (isLoading) return <ManagementSkeleton />;
  
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
      <div className="grid gap-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
        <PermissionManagement />
      </div>
    </div>
  );
}