import MetricCard from "@/components/dashboard/MetricCard";
import SalesChart from "@/components/dashboard/SalesChart";

// Sample data - in production, this would come from API
const sampleMetrics = {
    totalRevenue: 125420,
    totalSales: 1842,
    averageOrder: 68.15,
    conversionRate: 3.24,
};

const salesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseRevenue = 3000 + Math.random() * 2000;
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
    return {
        date: date.toISOString().split("T")[0],
        sales: Math.floor(40 + Math.random() * 30),
        revenue: Math.round(baseRevenue * weekendBoost),
    };
});

const recentOrders = [
    { id: "ORD-7892", customer: "Sarah Johnson", amount: 234.50, status: "completed", time: "2 min ago" },
    { id: "ORD-7891", customer: "Mike Chen", amount: 89.00, status: "processing", time: "5 min ago" },
    { id: "ORD-7890", customer: "Emma Wilson", amount: 567.25, status: "completed", time: "12 min ago" },
    { id: "ORD-7889", customer: "James Brown", amount: 145.00, status: "shipped", time: "18 min ago" },
    { id: "ORD-7888", customer: "Lisa Davis", amount: 312.75, status: "completed", time: "25 min ago" },
];

const lowStockItems = [
    { name: "Wireless Headphones", sku: "WH-001", stock: 5, reorderLevel: 20 },
    { name: "USB-C Cable Pack", sku: "USB-C-10", stock: 12, reorderLevel: 50 },
    { name: "Laptop Stand", sku: "LS-PRO", stock: 3, reorderLevel: 15 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Welcome back! Here's your store overview.
                    </p>
                </div>
                <button
                    className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
                    style={{ background: "var(--gradient-primary)" }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Report
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Revenue"
                    value={`$${sampleMetrics.totalRevenue.toLocaleString()}`}
                    change={12.5}
                    trend="up"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <MetricCard
                    title="Total Sales"
                    value={sampleMetrics.totalSales}
                    change={8.2}
                    trend="up"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                />
                <MetricCard
                    title="Average Order"
                    value={`$${sampleMetrics.averageOrder.toFixed(2)}`}
                    change={-2.3}
                    trend="down"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    }
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${sampleMetrics.conversionRate}%`}
                    change={0.5}
                    trend="up"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <SalesChart data={salesData} />
                </div>

                {/* Recent Orders */}
                <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <a href="/dashboard/sales" className="text-sm text-[hsl(var(--primary))] hover:underline">
                            View all
                        </a>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[hsl(var(--muted))] text-sm font-medium">
                                        {order.customer.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{order.customer}</p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{order.id} · {order.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">${order.amount.toFixed(2)}</p>
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${order.status === "completed" ? "bg-[hsl(var(--success),0.1)] text-[hsl(var(--success))]" :
                                            order.status === "processing" ? "bg-[hsl(var(--warning),0.1)] text-[hsl(var(--warning))]" :
                                                "bg-[hsl(var(--primary),0.1)] text-[hsl(var(--primary))]"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Low Stock Alerts */}
                <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[hsl(var(--warning))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
                        </div>
                        <a href="/dashboard/inventory" className="text-sm text-[hsl(var(--primary))] hover:underline">
                            View inventory
                        </a>
                    </div>
                    <div className="space-y-3">
                        {lowStockItems.map((item) => (
                            <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted))]">
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">SKU: {item.sku}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[hsl(var(--danger))]">{item.stock} left</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Reorder at {item.reorderLevel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Predictions Summary */}
                <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h3 className="text-lg font-semibold">AI Predictions</h3>
                        </div>
                        <a href="/dashboard/predictions" className="text-sm text-[hsl(var(--primary))] hover:underline">
                            View details
                        </a>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg" style={{ background: "var(--gradient-primary)", opacity: 0.1 }}>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span>Next 7-Day Forecast</span>
                                <span className="font-semibold">89% Confidence</span>
                            </div>
                            <p className="text-2xl font-bold">$28,450</p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Predicted revenue</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 p-3 rounded-lg bg-[hsl(var(--muted))]">
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Expected Sales</p>
                                <p className="text-lg font-semibold">423 orders</p>
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-[hsl(var(--muted))]">
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Top Category</p>
                                <p className="text-lg font-semibold">Electronics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
