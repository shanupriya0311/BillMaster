import { useEffect, useRef, useState } from "react";
import {
    Store, LayoutGrid, ShoppingCart, Package, Receipt,
    BarChart3, Users, Settings, LogOut, Clock, Bell,
    TrendingDown, TrendingUp, CheckCircle, PackageCheck
} from "lucide-react";
import Chart from "chart.js/auto";
import "./Dashboard.scss";
import { salesData } from "./salesdata";

export default function Dashboard() {
    const salesTrendRef = useRef(null);
    const categoryRef = useRef(null);
    const chartInstances = useRef({});

    const [stats, setStats] = useState({
        todaySales: 0,
        transactions: 0,
        tax: 0,
        lowStock: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {

        const sortedData = [...salesData].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDateStr = sortedData[0]?.date.split(",")[0]; 

        // Filter for "Today's" data
        const todayData = salesData.filter(item => item.date.startsWith(latestDateStr));

        const totalSalesToday = todayData.reduce((acc, curr) => acc + parseFloat(curr.amount.replace('₹', '')), 0);
        const totalTaxToday = todayData.reduce((acc, curr) => acc + parseFloat(curr.tax.replace('₹', '')), 0);

        setStats({
            todaySales: totalSalesToday.toLocaleString('en-IN'),
            transactions: todayData.length,
            tax: totalTaxToday.toLocaleString('en-IN'),
            lowStock: 0 
        });

        // 2. Recent Transactions
        setRecentTransactions(sortedData.slice(0, 4));

        // 3. Prepare Chart Data
        // Weekly Sales (Aggegate by Date -> Day Name)
        const weeklyMap = {};
        const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        salesData.forEach(item => {
            const date = new Date(item.date);
            const dayName = daysOrder[date.getDay()];
            const amount = parseFloat(item.amount.replace('₹', ''));
            weeklyMap[dayName] = (weeklyMap[dayName] || 0) + amount;
        });

        // Ensure all days are present for the chart label order? Or just map available? 
        // Let's stick to the days present or a fixed order. 
        // For the trend, let's sort by date if possible, but simplest is fixed day order.
        const chartLabels = daysOrder;
        const chartDataPoints = chartLabels.map(day => weeklyMap[day] || 0);

        // Category Sales
        const catMap = {};
        salesData.forEach(item => {
            const cat = item.Catagory;
            catMap[cat] = (catMap[cat] || 0) + 1; // Count or Value? Let's use Count for "Sales by Category"
        });
        const catLabels = Object.keys(catMap);
        const catDataPoints = Object.values(catMap);

        // --- Render Charts ---
        if (chartInstances.current.trend) chartInstances.current.trend.destroy();
        if (chartInstances.current.category) chartInstances.current.category.destroy();

        chartInstances.current.trend = new Chart(salesTrendRef.current, {
            type: "line",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Sales',
                    data: chartDataPoints,
                    borderColor: "#0D9488",
                    backgroundColor: "rgba(13,148,136,0.1)",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#0D9488",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "#e2e8f0",
                            borderDash: [5, 5]
                        },
                        ticks: {
                            callback: function (value) {
                                return '₹' + (value / 1000) + 'k';
                            },
                            font: { size: 11 },
                            color: "#64748b"
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 11 },
                            color: "#64748b"
                        },
                        border: { display: false }
                    }
                }
            }
        });

        chartInstances.current.category = new Chart(categoryRef.current, {
            type: "doughnut",
            data: {
                labels: catLabels,
                datasets: [{
                    data: catDataPoints,
                    backgroundColor: ["#0D9488", "#2DD4BF", "#5EEAD4", "#99F6E4", "#ccfbf1", "#14b8a6"],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 15, font: { size: 11 } }
                    }
                },
                cutout: "70%"
            }
        });

        return () => {
            if (chartInstances.current.trend) chartInstances.current.trend.destroy();
            if (chartInstances.current.category) chartInstances.current.category.destroy();
        };
    }, []);

    return (
        <div className="dashboard">

            {/* Sidebar REMOVED */}

            {/* Main */}
            <main className="content">
                <header className="header">
                    <h2 style={{ fontSize: '18px', margin: 0 }}>Dashboard</h2>
                </header>

                {/* Cards */}
                <section className="stats">
                    <Stat title="Today's Sales" value={`₹${stats.todaySales}`} icon={<TrendingDown />} />
                    <Stat title="Transactions" value={stats.transactions} icon={<Receipt />} />
                    <Stat title="Tax Collected" value={`₹${stats.tax}`} icon={<TrendingUp />} />
                    <Stat title="Low Stock Items" value={stats.lowStock} icon={<CheckCircle />} />
                </section>


                {/* Charts */}
                <section className="charts">
                    <div className="card large">
                        <h3>Weekly Sales Trend</h3>
                        <div style={{ height: '180px', width: '100%' }}>
                            <canvas ref={salesTrendRef}></canvas>
                        </div>
                    </div>

                    <div className="card small-chart">
                        <h3>Sales by Category</h3>
                        <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                            <canvas ref={categoryRef}></canvas>
                        </div>
                    </div>
                </section>

                {/* Bottom Section */}
                <section className="bottom-section">
                    <div className="card">
                        <div className="section-header">
                            <h3>Recent Transactions</h3>
                            <a href="#" style={{ fontSize: '12px', color: '#0d9488', textDecoration: 'none' }}>View all →</a>
                        </div>
                        <div className="transactions-list">
                            {recentTransactions.map((tx) => (
                                <Transaction key={tx.id} id={tx.id} amount={tx.amount} />
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-header">
                            <h3>Low Stock Alerts</h3>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>0 items</span>
                        </div>
                        <div className="empty-state">
                            <PackageCheck size={32} color="#0d9488" />
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#94a3b8' }}>All items are in stock</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function Stat({ title, value, icon }) {
    return (
        <div className="card stat">
            <div>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
            <div className="icon">{icon}</div>
        </div>
    );
}

function Transaction({ id, amount }) {
    return (
        <div className="transaction-item">
            <span style={{ fontSize: '13px', color: '#64748b' }}>{id}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{amount}</span>
        </div>
    );
}
