"use client";

interface SalesChartProps {
    data?: Array<{ date: string; sales: number; revenue: number }>;
    loading?: boolean;
}

export default function SalesChart({ data, loading = false }: SalesChartProps) {
    if (loading || !data) {
        return (
            <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-32 h-6 rounded shimmer" />
                    <div className="w-24 h-8 rounded shimmer" />
                </div>
                <div className="h-64 shimmer rounded-lg" />
            </div>
        );
    }

    // Simple bar chart visualization (in production, use Recharts or Chart.js)
    const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

    return (
        <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Sales Overview</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Daily revenue trend</p>
                </div>
                <div className="flex gap-2">
                    {["7D", "30D", "90D"].map((period) => (
                        <button
                            key={period}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${period === "30D"
                                    ? "text-white"
                                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                                }`}
                            style={period === "30D" ? { background: "var(--gradient-primary)" } : {}}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 flex items-end gap-1">
                {data.slice(-30).map((item, i) => {
                    const height = (item.revenue / maxRevenue) * 100;
                    return (
                        <div
                            key={i}
                            className="flex-1 group relative"
                            title={`${item.date}: $${item.revenue.toLocaleString()}`}
                        >
                            <div
                                className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                                style={{
                                    height: `${Math.max(height, 2)}%`,
                                    background: "var(--gradient-primary)",
                                }}
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                ${item.revenue.toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[hsl(var(--border))]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: "var(--gradient-primary)" }} />
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">Revenue</span>
                    </div>
                </div>
                <div className="flex gap-4 text-sm">
                    <div>
                        <span className="text-[hsl(var(--muted-foreground))]">Total: </span>
                        <span className="font-semibold">
                            ${data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-[hsl(var(--muted-foreground))]">Avg: </span>
                        <span className="font-semibold">
                            ${Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
