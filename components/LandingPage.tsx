"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import PricingTier from './PricingTier';
import FutureCard from './FutureCard';

export default function LandingPage() {
    const [email, setEmail] = useState('');
    const [businessSize, setBusinessSize] = useState('');
    const [showPricing, setShowPricing] = useState(false);

    const submitPotentialClient = useMutation(api.potentialClients.submitPotentialClientData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        if (!businessSize) {
            toast({
                title: "Business size required",
                description: "Please select your business size.",
                variant: "destructive",
            });
            return;
        }

        try {
            await submitPotentialClient({ email, businessSize });
            setShowPricing(true);
            toast({
                title: "Thank you!",
                description: "We've received your information. Here are our pricing options.",
            });
        } catch (error) {
            toast({
                title: "Submission failed",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    return (
        <>
            <Head>
                <title>AI Scheduler - Smart Scheduling with AI-Powered Insights</title>
                <meta name="description" content="Streamline your appointments and boost efficiency with our intelligent scheduling system." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <header className="container mx-auto px-4 py-8">
                    <nav className="flex justify-between items-center">
                        <span className="parallax text-2xl font-bold text-[#0AE980]">AI Scheduler</span>
                        <div>
                            <Link href="/sign-in" passHref>
                                <Button variant="ghost" className="mr-4">Sign In</Button>
                            </Link>
                        </div>
                    </nav>
                </header>

                <main className="container mx-auto px-4 py-16">
                    <section className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Smart Scheduling with <span className="text-[#0AE980]">AI-Powered Insights</span>
                        </h1>
                        <p className="text-xl mb-8">
                            Streamline your appointments and boost efficiency with our intelligent scheduling system.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <FutureCard
                            icon="Calendar"
                            title="Smart Scheduling"
                            description="AI-powered scheduling optimizes your appointments for maximum efficiency."
                        />
                        <FutureCard
                            icon="Clock"
                            title="Real-time Updates"
                            description="Get instant notifications and real-time updates on your appointments."
                        />
                        <FutureCard
                            icon="Users"
                            title="Multi-tenant Support"
                            description="Manage multiple businesses or locations from a single platform."
                        />
                        <FutureCard
                            icon="Sparkles"
                            title="AI Recommendations"
                            description="Receive intelligent suggestions for optimal scheduling and service offerings."
                        />
                        <FutureCard
                            icon="BarChart"
                            title="Analytics Dashboard"
                            description="Gain insights into your business performance with detailed analytics."
                        />
                    </section>

                    {!showPricing ? (
                        <section className="max-w-md mx-auto mb-16">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-gray-700 text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <Label>Business Size</Label>
                                            <RadioGroup value={businessSize} onValueChange={setBusinessSize}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="small" id="small" />
                                                    <Label htmlFor="small">Small (1-10 employees)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="medium" id="medium" />
                                                    <Label htmlFor="medium">Medium (11-50 employees)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="large" id="large" />
                                                    <Label htmlFor="large">Large (51+ employees)</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <Button type="submit" className="w-full bg-[#0AE980] hover:bg-[#09C870] text-gray-900">
                                            See Pricing
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </section>
                    ) : (
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <PricingTier
                                    name="Start Up"
                                    price={29.95}
                                    features={[
                                        "Up to 1 users",
                                        "Basic AI scheduling",
                                        "Real-time updates",
                                        "Email support"
                                    ]}
                                />
                                <PricingTier
                                    name="Experts"
                                    price={99.95}
                                    features={[
                                        "Up to 3 users",
                                        "Advanced AI scheduling",
                                        "Real-time updates",
                                        "AI recommendations",
                                        "Basic analytics",
                                        "Priority email support"
                                    ]}
                                />
                                <PricingTier
                                    name="Professional"
                                    price={499}
                                    features={[
                                        "Up to 5 users",
                                        "Advanced AI scheduling",
                                        "Real-time updates",
                                        "AI recommendations",
                                        "Advanced analytics",
                                        "24/7 phone support"
                                    ]}
                                />
                            </div>
                        </section>
                    )}
                </main>

                <footer className="bg-gray-800 py-8">
                    <div className="container mx-auto px-4 text-center text-gray-400">
                        <p>&copy; 2024 AI Scheduler. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    )
};