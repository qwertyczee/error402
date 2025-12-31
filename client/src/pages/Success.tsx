import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

interface Donation {
    id: string;
    amount: number;
    donorName: string | null;
    message: string | null;
}

export default function Success() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const [donation, setDonation] = useState<Donation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }

        api.get(`/verify-session/${sessionId}`)
            .then(({ data }) => {
                setDonation(data);
                triggerConfetti();
            })
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [sessionId, navigate]);

    const triggerConfetti = () => {
        const defaults = {
            spread: 360,
            ticks: 100,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['#22c55e', '#16a34a', '#4ade80', '#86efac'],
        };

        const shoot = () => {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ['circle', 'square'],
            });
            confetti({
                ...defaults,
                particleCount: 20,
                scalar: 0.75,
                shapes: ['circle'],
            });
        };

        shoot();
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
    };

    if (loading) {
        return (
            <div className="min-h-full bg-[#09090b] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#09090b] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-8 text-center space-y-6">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white">
                            Thank You!
                        </h1>
                        <p className="text-zinc-400">
                            Your support means everything.
                        </p>
                    </div>

                    {/* Donation Summary */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 space-y-4">
                        <div className="text-4xl font-bold text-green-400">
                            ${donation?.amount}
                        </div>

                        {donation?.donorName && (
                            <div className="text-sm text-zinc-400">
                                From{' '}
                                <span className="text-white font-medium">
                                    {donation.donorName}
                                </span>
                            </div>
                        )}

                        {donation?.message && (
                            <div className="pt-4 border-t border-zinc-700">
                                <p className="text-sm text-zinc-300 italic">
                                    "{donation.message}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full h-11 bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>

                    <p className="text-xs text-zinc-600">
                        A receipt has been sent to your email.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
