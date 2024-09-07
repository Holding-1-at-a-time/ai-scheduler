'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { AITimeSlotRecommendation } from "../components/AITimeSlotRecomendations"

interface Service {
    id: number
    name: string
    price: number
    duration: number
}

interface ScheduleFormProps {
    services: Service[]
    tenant: string
}

export default function ScheduleForm({ services, tenant }: Readonly<ScheduleFormProps>) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [selectedSlot, setSelectedSlot] = useState<string>('')

    const toggleService = (id: number) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const appointmentData = { date, selectedSlot, selectedServices, name, email, tenant }
        console.log('Appointment scheduled:', appointmentData)
        try {
            await fetch('/api/schedule-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData),
            })
            alert('Appointment scheduled successfully!')
        } catch (error) {
            alert('Error scheduling appointment. Please try again.')
            console.error(error)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Select Services</Label>
                <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
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
                services={services}
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
                    required
                />
            </div>
            <Button type="submit">Schedule Appointment</Button>
        </form>
    )
}