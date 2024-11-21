"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagement } from "@/components/UserManagement";
import { api } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { ManagementSkeleton } from "@/components/skeletons";

export default function Users() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.users.getAll
  });
  
  if (isLoading) return <ManagementSkeleton />;
  
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      <div className="grid gap-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
        <UserManagement />
      </div>
    </div>
  );
}
