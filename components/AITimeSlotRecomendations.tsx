'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useState } from 'react'

interface Service {
    id: number
    name: string
    duration: number
}

interface AITimeSlotRecommendationProps {
    date: Date | undefined
    selectedServices: number[]
    services: Service[]
    onSelectSlot: (slot: string) => void
}

export function AITimeSlotRecommendation({
    date,
    selectedServices,
    services,
    onSelectSlot
}: Readonly<AITimeSlotRecommendationProps>) {
    const [recommendedSlots, setRecommendedSlots] = useState<string[]>([])

    const simulateAIRecommendation = useCallback(async (date: Date, totalDuration: number): Promise<string[]> => {
        const response = await fetch('https://us-central1-ai-scheduler-340017.cloudfunctions.net/ai-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: date.toISOString(), totalDuration }),
        })
        const slots = (await response.json()) as string[]
        return slots
    }, [])
    
    useEffect(() => {
        if (date && selectedServices.length > 0) {
            // Simulating an API call to an AI service
            const fetchRecommendedSlots = async () => {
                const totalDuration = selectedServices.reduce((sum, id) =>
                    sum + (services.find(service => service.id === id)?.duration ?? 0), 0
                )
                const slots = await simulateAIRecommendation(date, totalDuration)
                setRecommendedSlots(slots)
            }
            fetchRecommendedSlots()
        }
    }, [date, selectedServices, services, simulateAIRecommendation])

    const simulateAIRecommendation = useCallback(async (date: Date, totalDuration: number): Promise<string[]> => {
        const response = await fetch('https://us-central1-ai-scheduler-340017.cloudfunctions.net/ai-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: date.toISOString(), totalDuration }),
        })
        const slots = (await response.json()) as string[]
        return slots
    }, [])



    return (
        <div>
            <Label>AI Recommended Time Slots</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {recommendedSlots.map((slot) => (
                    <Button
                        key={slot}
                        variant="outline"
                        onClick={() => onSelectSlot(slot)}
                    >
                        {slot}
                    </Button>
                ))}
            </div>
        </div>
    )
}