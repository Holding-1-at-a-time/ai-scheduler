import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FeedbackForm } from "@/components/FeedbackForm"
import { AITimeSlotRecommendation } from "@/components/AITimeSlotRecomendations";
import { getTenantConfig, TenantConfig } from '@/lib/tenant-config'
import ScheduleForm from '@/components/ScheduleForm'
import { useState, useEffect, Suspense } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Toast } from "@/components/ui/toast"

export default function SchedulePage({ params }: Readonly<{ params: { tenant: string } }>) {
    const [tenantConfig, setTenantConfig] = useState(null);
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [selectedSlot, setSelectedSlot] = useState<string>('')


    useEffect(() => {
        async function fetchTenantConfig() {
            const config = await getTenantConfig(params.tenant);
            setTenantConfig(config as TenantConfig);
        }
        fetchTenantConfig();
    }, [params.tenant]);

    if (!tenantConfig) {
        return <div>Loading...</div>;
    }

    const toggleService = (id: number) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Appointment scheduled:', { date, selectedSlot, selectedServices, name, email })
        try {
            await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, selectedSlot, selectedServices, name, email }),
            })
            // toast({
            //     title: 'Appointment Scheduled',
            //     description: 'Your appointment has been scheduled. We will contact you shortly.',
            //     variant: 'success',
            // })
        } catch (error) {
            // toast({
            //     title: 'Error',
            //     description: error.message || 'An error occurred. Please try again.',
            //     variant: 'error',
            // })
        }
    }

    const handleFeedback = async (feedback: any) => {
        console.log('Feedback received:', feedback)
        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedback),
            })
             toast({
                 title: 'Thank you for your feedback',
                 description: 'Your feedback helps us improve.',
                 variant: 'success',
             })
        } catch (error) {
            Toast({
                title: 'Error',
                description: error.message || 'An error occurred. Please try again.',
                variant: 'error',
            })
        }
    }

    if (!tenantConfig) {
        return <div>Loading...</div>
    }

    if (!tenantConfig.services) {
        return <div>No services available</div>
    }

    if (tenantConfig.services.length === 0) {

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule an Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div>Loading...</div>}>
                            <ScheduleForm services={tenantConfig.services} tenant={params.tenant} />
                        </Suspense>
                    </CardContent>
                </Card>
                <FeedbackForm onSubmit={(feedback) => console.log('Feedback received:', feedback)} />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Schedule an Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Select Services</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {tenantConfig.services.map((service) => (
                                    <div key={service.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`service-${service.id}`}
                                            checked={selectedServices.includes(service.id)}
                                            onCheckedChange={() => toggleService(service.id)}
                                        />
                                        <label
                                            htmlFor={`service-${service.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {service.name} - ${service.price}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                        <AITimeSlotRecommendation
                            date={date}
                            selectedServices={selectedServices}
                            services={tenantConfig.services}
                            onSelectSlot={setSelectedSlot}
                        />
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </div>
                        <Button type="submit">Schedule Appointment</Button>
                    </form>
                </CardContent>
            </Card>
            <FeedbackForm onSubmit={handleFeedback} />
        </div>
    )
}