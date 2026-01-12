interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    loading?: boolean;
}

export default function MetricCard({
    title,
    value,
    change,
    changeLabel = "vs last period",
    icon,
    trend = "neutral",
    loading = false,
}: MetricCardProps) {
    if (loading) {
        return (
            <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl shimmer" />
                    <div className="w-16 h-6 rounded shimmer" />
                </div>
                <div className="w-24 h-8 rounded shimmer mb-2" />
                <div className="w-32 h-4 rounded shimmer" />
            </div>
        );
    }

    const trendColors = {
        up: "metric-positive",
        down: "metric-negative",
        neutral: "metric-neutral",
    };

    const trendIcons = {
        up: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        ),
        down: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        ),
        neutral: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
        ),
    };

    return (
        <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] card-hover">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                >
                    <span className="text-white">{icon}</span>
                </div>

                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trendColors[trend]}`}>
                        {trendIcons[trend]}
                        <span>{Math.abs(change).toFixed(1)}%</span>
                    </div>
                )}
            </div>

            <p className="mb-1 text-sm font-medium text-[hsl(var(--muted-foreground))]">
                {title}
            </p>

            <p className="text-3xl font-bold tracking-tight animate-count">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>

            {changeLabel && change !== undefined && (
                <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                    {changeLabel}
                </p>
            )}
        </div>
    );
}
