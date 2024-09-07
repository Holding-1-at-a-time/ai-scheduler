'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Droplet, Spray, PaintBucket, Car, Shield, Sparkles, LucideIcon } from 'lucide-react'
import { getTenantConfig } from '@/lib/tenant-config'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Service {
    id: number;
    name: string;
    icon: LucideIcon;
    price: number;
}

const iconMap: Record<string, LucideIcon> = {
    'Droplet': Droplet,
    'Spray': Spray,
    'PaintBucket': PaintBucket,
    'Car': Car,
    'Shield': Shield,
    'Sparkles': Sparkles,
};

export default function ServicesPage({ params }: Readonly<{ params: { tenant: string } }>) {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);

    useEffect(() => {
        async function fetchTenantConfig() {
            const tenantConfig = await getTenantConfig(params.tenant);
            const mappedServices = tenantConfig.services.map((service: any) => ({
                ...service,
                icon: iconMap[service.icon]
            }));
            setServices(mappedServices);
        }
        fetchTenantConfig();
    }, [params.tenant]);

    const toggleService = (id: number) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
        );
    };

    const totalPrice = selectedServices.reduce((sum, id) =>
        sum + (services.find(service => service.id === id)?.price ?? 0), 0
    );

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Our Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {services.map(service => (
                            <div key={service.id} className="flex justify-between items-center">
                                <span>{service.name}</span>
                                <span>${service.price}</span>
                                <Button onClick={() => toggleService(service.id)}>
                                    {selectedServices.includes(service.id) ? 'Remove' : 'Add'}
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <h3>Total Price: ${totalPrice}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

//**
//*import { useState, useEffect } from 'react';
//*import { getTenantConfig } from '@/lib/tenant-config';
//*import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//*import { Button } from "@/components/ui/button";
//*
//*interface Service {
//*    id: number;
//*    name: string;
//*    icon: string; // Assuming icon is a string identifier; adjust as necessary
//*    price: number;
//*}
//*
//*interface TenantConfig {
//*    services: Service[];
//*}
//*
//*export default function ServicesPage({ params }: { params: { tenant: string } }) {
//*    const [services, setServices] = useState<Service[]>([]);
//*    const [selectedServices, setSelectedServices] = useState<number[]>([]);
//*
//*    useEffect(() => {
//*        async function fetchTenantConfig() {
//*            const tenantConfig: TenantConfig = await getTenantConfig(params.tenant);
//*            setServices(tenantConfig.services);
//*        }
//*        fetchTenantConfig();
//*    }, [params.tenant]);
//*
//*    const toggleService = (id: number) => {
//*        setSelectedServices(prev => prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]);
//*    };
//*
//*    const totalPrice = selectedServices.reduce((sum, id) => sum + (services.find(service => service.id === id)?.price ?? 0), 0);
//*
//*    return (
//*        <div className="max-w-2xl mx-auto">
//*            <Card>
//*                <CardHeader>
//*                    <CardTitle>Our Services</CardTitle>
//*                </CardHeader>
//*                <CardContent>
//*                    <div className="space-y-4">
//*                        {services.map(service => (
//*                            <div key={service.id} className="flex justify-between items-center">
//*                                <span>{service.name}</span>
//*                                <span>${service.price}</span>
//*                                <Button onClick={() => toggleService(service.id)}>
//*                                    {selectedServices.includes(service.id) ? 'Remove' : 'Add'}
//*                                </Button>
//*                            </div>
//*                        ))}
//*                    </div>
//*                    <div className="mt-4">
//*                        <h3>Total Price: ${totalPrice}</h3>
//*                    </div>
//*                </CardContent>
//*            </Card>
//*        </div>
//*    );
//*}
