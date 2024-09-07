'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { aiService } from "@/lib/ai-service"

export function AiQuery() {
    const [query, setQuery] = useState('')
    const [answer, setAnswer] = useState('')

    const handleQuery = async () => {
        const response = await aiService.processNaturalLanguageQuery(query);
        setAnswer(response);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ask about Automotive Detailing</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <Input
                        placeholder="Ask a question about automotive detailing..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button onClick={handleQuery}>Ask AI</Button>
                </div>
                {answer && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                        <h3 className="font-semibold mb-2">Answer:</h3>
                        <p>{answer}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}