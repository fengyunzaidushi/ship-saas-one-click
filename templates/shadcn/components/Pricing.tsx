import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        id: "plan-free",
        href: "#",
        price: { monthly: "$0", annually: "$0" },
        description: "Perfect for trying out our name generator.",
        actionTitle: "Get started",
        features: [
            "3 name suggestions per generation",
            "Basic name styles (Modern, Classical)",
            "Basic character traits",
            "Email support",
        ],
        popular: false,
    },
    {
        name: "Pro",
        id: "plan-pro",
        href: "#",
        price: { monthly: "$9", annually: "$90" },
        description: "Ideal for serious writers and novelists.",
        actionTitle: "Get started",
        features: [
            "10 name suggestions per generation",
            "All name styles including Fantasy & Gothic",
            "Advanced character trait combinations",
            "Name history & meaning analysis",
            "Save favorite names",
            "Priority email support",
        ],
        popular: true,
    },
    {
        name: "Team",
        id: "plan-team",
        href: "#",
        price: { monthly: "$29", annually: "$290" },
        description: "Perfect for writing teams and studios.",
        actionTitle: "Contact sales",
        features: [
            "Unlimited name suggestions",
            "Custom name style creation",
            "Team collaboration features",
            "Name conflict detection",
            "API access",
            "24/7 priority support",
            "Team training session",
        ],
        popular: false,
    },
];

export default function () {
    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl sm:text-center">
                    <h2 className="text-base font-semibold leading-7 text-muted-foreground">
                        Pricing
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                        Choose the perfect plan for your needs
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-center">
                    ConvertFast offers flexible pricing options to suit developers and
                    teams of all sizes. Start building stunning landing pages faster than
                    ever.
                </p>
                <div className="mt-20 flow-root">
                    <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 gap-x-4 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 xl:-mx-4">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "flex flex-col",
                                    plan.popular ? "ring-1 ring-primary" : ""
                                )}
                            >
                                <CardHeader>
                                    <CardTitle
                                        id={plan.id}
                                        className="text-base font-semibold leading-7"
                                    >
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="mt-6 flex items-baseline gap-x-1">
                                        <span className="text-5xl font-bold tracking-tight text-primary">
                                            {plan.price.monthly}
                                        </span>
                                        <span className="text-sm font-semibold leading-6 text-muted-foreground">
                                            /month
                                        </span>
                                    </CardDescription>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                        {plan.price.annually} billed annually
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="mt-10 text-sm font-semibold leading-6 text-primary">
                                        {plan.description}
                                    </p>
                                    <ul
                                        role="list"
                                        className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground"
                                    >
                                        {plan.features.map((feature) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button className="w-full" aria-describedby={plan.id} asChild>
                                        <a href={plan.href}>{plan.actionTitle}</a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
