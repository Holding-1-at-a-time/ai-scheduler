import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
}

const FutureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
    <Card
        className="bg-white rounded-lg shadow-lg p-6 md:p-8"
        style={{ border: 'none', backgroundImage: 'linear-gradient(to bottom, #f7f7f7, #fff)' }}
    >
        <CardHeader className="flex items-center mb-4">
            <Icon className="w-12 h-12 text-[#47ffe7] mr-4" />
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-lg">
            <p className="mb-4">{description}</p>
        </CardContent>
    </Card>
);

export default FutureCard