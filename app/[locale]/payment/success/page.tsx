"use client"
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccess() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        // 这里可以添加支付成功后的逻辑
        console.log('Payment successful, session ID:', sessionId)
    }, [sessionId])

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground">
                Thank you for your purchase. Your credits will be added to your account shortly.
            </p>
            <Button>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    )
} 