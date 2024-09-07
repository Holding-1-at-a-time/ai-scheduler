'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CustomerForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        carMake: '',
        carModel: '',
        carYear: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="carMake">Car Make</Label>
                        <Input
                            type="text"
                            id="carM
              ake"
                            name="carMake"
                            value={formData.carMake}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="carModel">Car Model</Label>
                        <Input
                            type="text"
                            id="carModel"
                            name="carModel"
                            value={formData.carModel}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="carYear">Car Year</Label>
                        <Input
                            type="number"
                            id="carYear"
                            name="carYear"
                            value={formData.carYear}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
    )
}