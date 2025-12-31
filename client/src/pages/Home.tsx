import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Zap, MessageSquare, User, ArrowRight } from 'lucide-react';

interface Donation {
    id: string;
    amount: number;
    donorName: string | null;
    message: string | null;
    createdAt: string;
}

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [amount, setAmount] = useState(5);
    const [donorName, setDonorName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/donations')
            .then((res) => setDonations(res.data))
            .catch(console.error);
    }, []);

    const handleDonate = async () => {
        if (amount < 1) return;
        setLoading(true);
        try {
            const { data } = await api.post('/create-session', {
                amount,
                donorName,
                message,
            });
            window.location.href = data.url;
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const presets = [3, 5, 10, 25];

    return (
        <div className="min-h-full bg-[#09090b]">
            <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Error 402: Payment Required
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Support my Projects
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto">
                        Your contribution helps keep my projects alive and
                        running.
                    </p>
                </header>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Donation Form */}
                    <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-6 space-y-6">
                            {/* Amount Presets */}
                            <div className="space-y-3">
                                <label className="text-sm text-zinc-400">
                                    Amount
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {presets.map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`py-2.5 rounded-lg text-sm font-medium transition-all
                                            ${
                                                amount === val
                                                    ? 'bg-white text-black'
                                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                            }`}
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                        $
                                    </span>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(Number(e.target.value))
                                        }
                                        className="pl-7 bg-zinc-800/50 border-zinc-700 text-white h-11"
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">
                                    Name (optional)
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <Input
                                        placeholder="Anonymous"
                                        value={donorName}
                                        onChange={(e) =>
                                            setDonorName(e.target.value)
                                        }
                                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white h-11 placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">
                                    Message (optional)
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                    <Textarea
                                        placeholder="Say something nice..."
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white min-h-[100px] placeholder:text-zinc-600 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                onClick={handleDonate}
                                disabled={loading || amount < 1}
                                className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-medium text-base glow"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Donate ${amount}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Donations Feed */}
                    <Card className="lg:col-span-3 bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    Recent Supporters
                                </h2>
                                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                                    {donations.length} total
                                </span>
                            </div>

                            <ScrollArea className="h-[420px] pr-4">
                                {donations.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                        <MessageSquare className="h-10 w-10 mb-3 opacity-50" />
                                        <p>No donations yet</p>
                                        <p className="text-sm">
                                            Be the first to contribute!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {donations.map((d) => (
                                            <div
                                                key={d.id}
                                                className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium text-white uppercase">
                                                            {d.donorName?.[0] ||
                                                                '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">
                                                                {d.donorName ||
                                                                    'Anonymous'}
                                                            </p>
                                                            <p className="text-xs text-zinc-500">
                                                                {new Date(
                                                                    d.createdAt
                                                                ).toLocaleDateString(
                                                                    'en-US',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-green-400">
                                                        +${d.amount}
                                                    </span>
                                                </div>
                                                {d.message && (
                                                    <p className="mt-3 text-sm text-zinc-400 pl-12">
                                                        {d.message}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
