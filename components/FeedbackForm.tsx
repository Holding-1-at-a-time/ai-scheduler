'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function FeedbackForm({ onSubmit }: { onSubmit: (feedback: any) => void }) {
    const [rating, setRating] = useState<string>('')
    const [comment, setComment] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ rating, comment })
        setRating('')
        setComment('')
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>How would you rate your experience?</Label>
                        <RadioGroup value={rating} onValueChange={setRating}>
                            {['1', '2', '3', '4', '5'].map((value) => (
                                <div key={value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={value} id={`rating-${value}`} />
                                    <Label htmlFor={`rating-${value}`}>{value} Star{value !== '1' ? 's' : ''}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div>
                        <Label htmlFor="comment">Any additional comments?</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your feedback helps us improve"
                        />
                    </div>
                    <Button type="submit">Submit Feedback</Button>
                </form>
            </CardContent>
        </Card>
    )
}