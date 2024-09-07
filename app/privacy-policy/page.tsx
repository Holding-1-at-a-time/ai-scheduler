import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p>
                        At AutoDetailAI, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <h2 className="text-xl font-semibold">Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as your name, email address, and appointment details when you use our services.
                    </p>
                    <h2 className="text-xl font-semibold">How We Use Your Information</h2>
                    <p>
                        We use your information to provide and improve our services, communicate with you about appointments, and ensure the security of our platform.
                    </p>
                    <h2 className="text-xl font-semibold">Data Security</h2>
                    <p>
                        We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <h2 className="text-xl font-semibold">Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.
                    </p>
                    <h2 className="text-xl font-semibold">Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}