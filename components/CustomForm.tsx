'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CustomerForm({ onSubmit }: Readonly<{ onSubmit: (data: any) => void }>) {
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

    const getInputType = (key: string) => {
        if (key === 'email') {
            return 'email';
        }
        if (key === 'phone') {
            return 'tel';
        }
        return 'text';
    };

    return (
        <Card className="bg-[#707070]/50 border-[#0AE98]/20">
            <CardHeader>
                <CardTitle className="text-[#0AE98]">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.entries(formData).map(([key, value]) => (
                        <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Label htmlFor={key} className="text-white">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <Input
                                type={getInputType(key)}
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleChange}
                                required
                                className="bg-[#707070] border-[#0AE98]/20 text-white"
                            />
                        </motion.div>
                    ))}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="submit" className="w-full bg-[#0AE98] text-[#707070] hover:bg-[#0AE98]/80">
                            Submit
                        </Button>
                    </motion.div>
                </form>
            </CardContent>
        </Card>
    )
}