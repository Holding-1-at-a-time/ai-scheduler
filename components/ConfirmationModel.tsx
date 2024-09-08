'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Button } from "@/components/ui/button"

export function ConfirmationModal({
    isOpen,
    onClose,
    appointmentDetails
}: Readonly<{
    isOpen: boolean
    onClose: () => void
    appointmentDetails: {
        date: string
        time: string
        services: string[]
        totalPrice: number
    }
}>) {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        colors={['#0AE98', '#707070', '#ffffff']}
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-[#707070] p-6 rounded-lg shadow-xl max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-[#0AE98]">Appointment Confirmed!</h2>
                        <div className="space-y-2 text-white">
                            <p><strong>Date:</strong> {appointmentDetails.date}</p>
                            <p><strong>Time:</strong> {appointmentDetails.time}</p>
                            <p><strong>Services:</strong> {appointmentDetails.services.join(', ')}</p>
                            <p><strong>Total Price:</strong> ${appointmentDetails.totalPrice}</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                            <Button onClick={onClose} className="w-full bg-[#0AE98] text-[#707070] hover:bg-[#0AE98]/80">
                                Close
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}