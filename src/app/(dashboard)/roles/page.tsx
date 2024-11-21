'use client'
import { RoleManagement } from "@/components/Rolemanagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { ManagementSkeleton } from "@/components/skeletons";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: api.roles.getAll
  });
  
  if (isLoading) return <ManagementSkeleton />;
  
  return (     
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
      <div className="grid gap-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
        <RoleManagement />
      </div>
    </div>
  );
}