'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
}: AITimeSlotRecommendationProps) {
    const [recommendedSlots, setRecommendedSlots] = useState<string[]>([])

    useEffect(() => {
        if (date && selectedServices.length > 0) {
            // Simulating an API call to an AI service
            const fetchRecommendedSlots = async () => {
                const totalDuration = selectedServices.reduce((sum, id) =>
                    sum + (services.find(service => service.id === id)?.duration || 0), 0
                )
                const slots = await simulateAIRecommendation(date, totalDuration)
                setRecommendedSlots(slots)
            }
            fetchRecommendedSlots()
        }
    }, [date, selectedServices, services, simulateAIRecommendation])

    /**
     * Simulates an API call to an AI service to get the recommended time slots based on the given date and total duration of the services.
     * @param {Date} date The date to get the recommended time slots for.
     * @param {number} totalDuration The total duration of the services in minutes.
     * @returns {Promise<string[]>} A promise that resolves with an array of strings representing the recommended time slots in 24-hour format.
     */
    const simulateAIRecommendation = useCallback(async (date: Date, totalDuration: number): Promise<string[]> => {
      const response = await fetch('https://us-central1-ai-scheduler-340017.cloudfunctions.net/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString(), totalDuration }),
      })
      const slots = (await response.json()) as string[]
      return slots
    }, [])


    const generateTimeSlots = (date: Date, duration: number) => {
        const slots = []
        const start = new Date(date.setHours(9, 0, 0, 0))
        const end = new Date(date.setHours(17, 0, 0, 0))
        while (start < end) {
            slots.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            start.setMinutes(start.getMinutes() + duration)
        }
        return slots
    }

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