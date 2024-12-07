import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentCancel() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-muted-foreground">
                Your payment was cancelled. You can try again when you&apos;re ready.
            </p>
            <Button>
                <Link href="/">
                    Back to Home
                </Link>
            </Button>
        </div>
    )
} 