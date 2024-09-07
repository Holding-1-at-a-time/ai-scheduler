'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarIcon, CarIcon, DollarSignIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIQuery } from "../components/AI-Query"
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function DashboardPage({ params }: Readonly<{ params: { tenant: string } }>) {
    const { userId } = auth();
    const tenant = useQuery(api.tenants.getTenantBySubdomain, { subdomain: params.tenant });
    const appointments = useQuery(api.appointments.getAppointments, { tenantId: tenant?._id });
    const services = useQuery(api.services.getServices, { tenantId: tenant?._id });

    if (!userId) {
        redirect(`/${params.tenant}/sign-in`);
    }

    if (!tenant || !appointments || !services) return <div>Loading...</div>;

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as string || "customer";
    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce((total, apt) => {
        return total + apt.serviceIds.reduce((serviceTotal, serviceId) => {
            const service = services.find(s => s._id === serviceId);
            return serviceTotal + (service?.price || 0);
        }, 0);
    }, 0);
    const vehiclesServiced = new Set(appointments.map(apt => apt.customerId)).size;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAppointments}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vehicles Serviced</CardTitle>
                        <CarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehiclesServiced}</div>
                    </CardContent>
                </Card>
            </div>
            <AIQuery />
            {role === "admin" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Here you can manage your business settings and view analytics.</p>
                        {/* Add admin-specific controls here */}
                    </CardContent>
                </Card>
            )}

            {(role === "admin" || role === "staff") && (
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Here you can view and manage upcoming appointments.</p>
                        // TODO: Implement and Add appointment management interface here
                    </CardContent>
                </Card>
            )}

            {role === "customer" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Here you can view your upcoming and past appointments.</p>
                        {/* TODO: Implement and Add customer appointment view here */}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}