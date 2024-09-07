'use client'

import { useState, useEffect } from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { aiService } from "@/lib/ai-service"

export function AiRecommendation({ tenantId, customerId }: Readonly<{ tenantId: Id<"tenants">, customerId?: Id<"customers"> }>) {
    const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: '' })
    const [recommendations, setRecommendations] = useState<string[]>([])

    const customerProfile = useQuery(api.customers.getCustomerProfile, { customerId });
    const serviceHistory = useQuery(api.serviceHistory.getServiceHistory, { customerId });

    useEffect(() => {
        if (customerProfile && serviceHistory) {
            const getRecommendations = async () => {
                const aiRecommendations = await aiService.generatePersonalizedRecommendations(
                    JSON.stringify(customerProfile),
                    JSON.stringify(serviceHistory)
                );
                setRecommendations(aiRecommendations);
            };
            getRecommendations();
        }
    }, [customerProfile, serviceHistory]);

    const handleRecommendation = async () => {
        const aiRecommendations = await aiService.generatePersonalizedRecommendations(
            JSON.stringify({ ...customerProfile, vehicle: vehicleInfo }),
            JSON.stringify(serviceHistory)
        );
        setRecommendations(aiRecommendations);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Service Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="make">Car Make</Label>
                        <Input
                            id="make"
                            value={vehicleInfo.make}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, make: e.target.value }))}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="model">Car Model</Label>
                        <Input
                            id="model"
                            value={vehicleInfo.model}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, model: e.target.value }))}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="year">Car Year</Label>
                        <Input
                            id="year"
                            value={vehicleInfo.year}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, year: e.target.value }))}
                        />
                    </div>
                    <Button onClick={handleRecommendation}>Get Recommendation</Button>
                </div>
                {recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                        <h3 className="font-semibold mb-2">Recommended Services:</h3>
                        <ul className="list-disc pl-5">
                            {recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}