import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog"

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    appointmentDetails
}: Readonly<{
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    appointmentDetails: {
        date: string
        time: string
        services: string[]
        totalPrice: number
    }
}>) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please review your appointment details:
                        <ul className="mt-2 space-y-1">
                            <li>Date: {appointmentDetails.date}</li>
                            <li>Time: {appointmentDetails.time}</li>
                            <li>Services: {appointmentDetails.services.join(', ')}</li>
                            <li>Total Price: ${appointmentDetails.totalPrice}</li>
                        </ul>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Confirm Booking</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}