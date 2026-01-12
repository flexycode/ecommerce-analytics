import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,25%,8%)] via-[hsl(260,30%,12%)] to-[hsl(220,25%,8%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(220,90%,56%,0.15)] rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(260,80%,65%,0.15)] rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full glass-card">
          <span className="w-2 h-2 bg-[hsl(142,76%,45%)] rounded-full pulse" />
          <span className="text-[hsl(var(--muted-foreground))]">AI-Powered Analytics Platform</span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl mb-6 text-5xl font-bold leading-tight tracking-tight text-center md:text-7xl gradient-text">
          E-commerce Analytics Dashboard
        </h1>

        <p className="max-w-2xl mb-12 text-lg text-center text-[hsl(var(--muted-foreground))] md:text-xl">
          Real-time analytics with AI-powered sales predictions, inventory management,
          and customizable dashboards for data-driven decisions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Open Dashboard
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold glass-card text-[hsl(var(--foreground))] hover:scale-105 transition-all"
          >
            View Documentation
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 mt-24 md:grid-cols-3 max-w-5xl w-full">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              title: "30% Sales Increase",
              description: "AI-powered predictions drive smarter decisions and higher conversion rates",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Real-time Tracking",
              description: "Monitor inventory and sales in real-time with sub-second latency",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              ),
              title: "Custom Dashboards",
              description: "Drag-and-drop widgets to build your perfect analytics view",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 glass-card card-hover">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white">{feature.icon}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-[hsl(var(--muted-foreground))]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Kubernetes'].map((tech) => (
              <span key={tech} className="text-lg font-semibold">{tech}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
