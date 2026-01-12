"use client";

import { useState } from "react";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="flex items-center justify-between h-16 px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Live Indicator */}
                <div className="live-indicator">
                    <span>Live</span>
                </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products, sales, analytics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-[hsl(var(--muted))] border border-transparent focus:border-[hsl(var(--primary))] focus:outline-none transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[hsl(var(--danger))] rounded-full" />
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ background: 'var(--gradient-primary)' }}>
                        JD
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Admin</p>
                    </div>
                    <svg className="w-4 h-4 text-[hsl(var(--muted-foreground))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
