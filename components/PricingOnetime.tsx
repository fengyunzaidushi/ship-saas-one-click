"use client"
import { useRouter } from "next/navigation"
import { useLocale } from 'next-intl'

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useEffect, useState, useMemo } from 'react'

export default function PricingOnetime() {
    const t = useTranslations('price_onetime')
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const basic_onetime_price_id = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_ONETIME
    const pro_onetime_price_id = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ONETIME
    const locale = useLocale()

    const plans = useMemo(() => {
        const rawPlans = (t.raw('plans') as any[]) || []
        if (rawPlans.length > 0) {
            return rawPlans.map((plan, index) => ({
                ...plan,
                priceId: index === 0 ? basic_onetime_price_id : pro_onetime_price_id
            }));
        }
        return [];
    }, [t, basic_onetime_price_id, pro_onetime_price_id]);

    const faqs = useMemo(() => {
        return (t.raw('faq') as any[]) || [];
    }, [t]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/auth/check-session')
                const data = await response.json()
                
                if (data.user) {
                    setUserId(data.user.id)
                } else {
                    setUserId(null)
                }
            } catch (error) {
                console.error('Error checking auth status:', error)
                setUserId(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuthStatus()
        const interval = setInterval(checkAuthStatus, 3600000)
        return () => clearInterval(interval)
    }, [])

    const handlePurchase = async (priceId: string) => {
        console.log("priceId is", priceId)
        if (!userId) {
            toast.error("Please login first")
            sessionStorage.setItem('intended_purchase', priceId)
            router.push("/login")
            return
        }

        if (loading) {
            toast.error("Please wait...")
            return
        }

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId,
                    locale,
                }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const { url } = await response.json()
            if (url) {
                window.location.href = url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error("Something went wrong. Please try again.")
        }
    }

    return (
        <div className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-primary mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-4">
                        {t('description')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {t('tip')}
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-2xl border p-8 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                            {plan.popular && (
                                <Badge className="absolute top-4 right-4" variant="default">
                                    Most Popular
                                </Badge>
                            )}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="text-muted-foreground mt-2">{plan.description}</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.originalPrice && (
                                        <span className="ml-2 text-muted-foreground line-through">
                                            {plan.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <p className="text-lg font-semibold mt-2">{plan.credits}</p>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature: string, featureIdx: number) => (
                                    <li key={featureIdx} className="flex items-center">
                                        <Check className="h-4 w-4 text-primary mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                onClick={() => handlePurchase(plan.priceId)}
                                className="w-full"
                            >
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b pb-6">
                                <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
