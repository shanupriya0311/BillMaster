import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Download, FileText, Mail, FileSpreadsheet } from "lucide-react";
import "./Reports.scss";
import { salesData } from "./salesdata";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ManagerReports = () => {
    const teal = "#14b8a6";

    // Helper function to parse currency string to number
    const parseCurrency = (str) => parseFloat(str.replace(/[₹,]/g, "")) || 0;

    // Calculate End of Day metrics
    const calculateMetrics = () => {
        const totalSales = salesData.reduce((sum, sale) => sum + parseCurrency(sale.amount), 0);
        const totalTransactions = salesData.length;
        const totalTax = salesData.reduce((sum, sale) => sum + parseCurrency(sale.tax), 0);
        const netRevenue = salesData.reduce((sum, sale) => sum + parseCurrency(sale.subtotal), 0);

        return {
            grossSales: totalSales.toFixed(2),
            transactions: totalTransactions,
            taxCollected: totalTax.toFixed(2),
            netRevenue: netRevenue.toFixed(2)
        };
    };

    // Calculate payment breakdown
    const calculatePaymentBreakdown = () => {
        const paymentTotals = { Cash: 0, Card: 0, UPI: 0 };

        salesData.forEach(sale => {
            const amount = parseCurrency(sale.amount);
            if (paymentTotals.hasOwnProperty(sale.payment)) {
                paymentTotals[sale.payment] += amount;
            }
        });

        const total = Object.values(paymentTotals).reduce((sum, val) => sum + val, 0);

        return Object.entries(paymentTotals).map(([method, amount]) => ({
            method,
            amount: amount.toFixed(2),
            percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : "0.0"
        }));
    };

    // Calculate weekly sales (last 7 days)
    const calculateWeeklySales = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklySales = {};

        salesData.forEach(sale => {
            const date = new Date(sale.date);
            const dayName = days[date.getDay()];
            const amount = parseCurrency(sale.amount);

            if (!weeklySales[dayName]) {
                weeklySales[dayName] = 0;
            }
            weeklySales[dayName] += amount;
        });

        return weeklySales;
    };

    // Calculate sales by category
    const calculateCategorySales = () => {
        const categorySales = {};

        salesData.forEach(sale => {
            const category = sale.Catagory;
            const amount = parseCurrency(sale.amount);

            if (!categorySales[category]) {
                categorySales[category] = 0;
            }
            categorySales[category] += amount;
        });

        return Object.entries(categorySales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 categories
    };

    // Group sales by date for tax report
    const calculateTaxByDate = () => {
        const dateGroups = {};

        salesData.forEach(sale => {
            const dateStr = new Date(sale.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });

            if (!dateGroups[dateStr]) {
                dateGroups[dateStr] = {
                    taxableSales: 0,
                    tax: 0,
                    transactions: 0
                };
            }

            dateGroups[dateStr].taxableSales += parseCurrency(sale.subtotal);
            dateGroups[dateStr].tax += parseCurrency(sale.tax);
            dateGroups[dateStr].transactions += 1;
        });

        return Object.entries(dateGroups).map(([date, data]) => ({
            date,
            ...data
        }));
    };

    const metrics = calculateMetrics();
    const paymentBreakdown = calculatePaymentBreakdown();
    const weeklySalesData = calculateWeeklySales();
    const categorySalesData = calculateCategorySales();
    const taxByDate = calculateTaxByDate();

    // Export to Excel
    const handleExportExcel = () => {
        // Create workbook
        const wb = XLSX.utils.book_new();

        // Sheet 1: End of Day Summary
        const summaryData = [
            ["BillMaster - Reports & Analytics"],
            ["End of Day Settlement"],
            [""],
            ["Metric", "Value"],
            ["Gross Sales", `₹${metrics.grossSales}`],
            ["Transactions", metrics.transactions],
            ["Tax Collected", `₹${metrics.taxCollected}`],
            ["Net Revenue", `₹${metrics.netRevenue}`],
            [""],
            ["Payment Breakdown"],
            ["Method", "Amount", "Percentage"],
            ...paymentBreakdown.map(p => [p.method, `₹${p.amount}`, `${p.percentage}%`])
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, "Summary");

        // Sheet 2: Sales Data
        const salesHeaders = [["Transaction ID", "Date", "Cashier", "Payment", "Category", "Item", "Qty", "Subtotal", "Tax", "Total", "Amount"]];
        const salesRows = salesData.map(sale => [
            sale.id,
            sale.date,
            sale.cashier,
            sale.payment,
            sale.Catagory,
            sale.item,
            sale.qty,
            sale.subtotal,
            sale.tax,
            sale.total,
            sale.amount
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([...salesHeaders, ...salesRows]);
        XLSX.utils.book_append_sheet(wb, ws2, "Sales Data");

        // Sheet 3: Tax Report
        const taxHeaders = [["Date", "Taxable Sales", "Tax", "Transactions"]];
        const taxRows = taxByDate.map(row => [
            row.date,
            `₹${row.taxableSales.toFixed(2)}`,
            `₹${row.tax.toFixed(2)}`,
            row.transactions
        ]);
        const ws3 = XLSX.utils.aoa_to_sheet([...taxHeaders, ...taxRows]);
        XLSX.utils.book_append_sheet(wb, ws3, "Tax Report");

        // Download
        XLSX.writeFile(wb, `BillMaster_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };

    // Export to PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("BillMaster - Reports & Analytics", 14, 20);

        doc.setFontSize(12);
        doc.text("End of Day Settlement", 14, 30);

        // Metrics Section
        doc.setFontSize(10);
        let yPos = 40;
        doc.text(`Gross Sales: ₹${metrics.grossSales}`, 14, yPos);
        doc.text(`Transactions: ${metrics.transactions}`, 14, yPos + 7);
        doc.text(`Tax Collected: ₹${metrics.taxCollected}`, 14, yPos + 14);
        doc.text(`Net Revenue: ₹${metrics.netRevenue}`, 14, yPos + 21);

        // Payment Breakdown Table
        yPos += 35;
        doc.autoTable({
            startY: yPos,
            head: [['Payment Method', 'Amount', 'Percentage']],
            body: paymentBreakdown.map(p => [p.method, `₹${p.amount}`, `${p.percentage}%`]),
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });

        // Tax Collection Table
        yPos = doc.lastAutoTable.finalY + 15;
        doc.text("Tax Collection Report", 14, yPos);
        doc.autoTable({
            startY: yPos + 5,
            head: [['Date', 'Taxable Sales', 'Tax', 'Transactions']],
            body: taxByDate.map(row => [
                row.date,
                `₹${row.taxableSales.toFixed(2)}`,
                `₹${row.tax.toFixed(2)}`,
                row.transactions
            ]),
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
                14,
                doc.internal.pageSize.height - 10
            );
        }

        // Download
        doc.save(`BillMaster_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    };

    // Email Report
    const handleEmailReport = () => {
        const subject = encodeURIComponent("BillMaster - Sales Report");
        const body = encodeURIComponent(
            `Hi,\n\nPlease find the sales report summary:\n\n` +
            `Gross Sales: ₹${metrics.grossSales}\n` +
            `Transactions: ${metrics.transactions}\n` +
            `Tax Collected: ₹${metrics.taxCollected}\n` +
            `Net Revenue: ₹${metrics.netRevenue}\n\n` +
            `Payment Breakdown:\n` +
            paymentBreakdown.map(p => `${p.method}: ₹${p.amount} (${p.percentage}%)`).join('\n') +
            `\n\nGenerated on ${new Date().toLocaleString()}\n\n` +
            `Best regards,\nBillMaster POS`
        );

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };


    // Prepare weekly sales chart data
    const daysOrder = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
    const weeklySales = {
        labels: daysOrder,
        datasets: [
            {
                data: daysOrder.map(day => weeklySalesData[day] || 0),
                backgroundColor: teal,
                borderRadius: 8,
                barThickness: 32,
            },
        ],
    };

    const weeklyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: v => `₹${v}`, color: "#64748b" },
                grid: { color: "#f1f5f9" },
            },
            x: { grid: { display: false }, ticks: { color: "#64748b" } },
        },
    };

    // Prepare category sales chart data
    const categoryData = {
        labels: categorySalesData.map(([category]) => category),
        datasets: [
            {
                data: categorySalesData.map(([, amount]) => amount),
                backgroundColor: teal,
                borderRadius: 8,
                barThickness: 20,
            },
        ],
    };

    const categoryOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: { callback: v => `₹${v}`, color: "#64748b" },
                grid: { color: "#f1f5f9" },
            },
            y: { grid: { display: false }, ticks: { color: "#64748b" } },
        },
    };

    return (
        <main className="content">
            {/* Header */}
            < header className="page-header" >
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Business insights and data exports</p>
                </div>

                <div className="actions">
                    <button className="btn outline" onClick={handleExportExcel}>
                        <Download size={16} /> Export Excel
                    </button>
                    <button className="btn outline" onClick={handleExportPDF}>
                        <FileText size={16} /> Export PDF
                    </button>
                    <button className="btn primary" onClick={handleEmailReport}>
                        <Mail size={16} /> Email Report
                    </button>
                </div>
            </header >

            {/* End of Day */}
            < section className="card" >
                <div className="card-head">
                    <h3>End of Day Settlement</h3>
                    <span>Tuesday, December 17</span>
                </div>

                <div className="metrics">
                    {[
                        ["Gross Sales", `₹${metrics.grossSales}`],
                        ["Transactions", metrics.transactions],
                        ["Tax Collected", `₹${metrics.taxCollected}`],
                        ["Net Revenue", `₹${metrics.netRevenue}`, "green"],
                    ].map(([label, value, color]) => (
                        <div className="metric" key={label}>
                            <span>{label}</span>
                            <strong className={color}>{value}</strong>
                        </div>
                    ))}
                </div>

                <h4 className="sub-title">Payment Breakdown</h4>

                <div className="payments">
                    {paymentBreakdown.map(({ method, amount, percentage }) => (
                        <div className="payment-card" key={method}>
                            <h5>{method}</h5>
                            <strong>₹{amount}</strong>
                            <span>{percentage}% of total</span>
                        </div>
                    ))}
                </div>
            </section >

            {/* Charts */}
            < section className="charts" >
                <div className="chart-card">
                    <h3>Weekly Sales Comparison</h3>
                    <div className="chart-box">
                        <Bar data={weeklySales} options={weeklyOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Sales by Category</h3>
                    <div className="chart-box">
                        <Bar data={categoryData} options={categoryOptions} />
                    </div>
                </div>
            </section >

            {/* Table */}
            < section className="card" >
                <div className="card-head">
                    <h3>Tax Collection Report</h3>
                    <button className="btn outline small">
                        <FileSpreadsheet size={16} /> Export for Filing
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Taxable Sales</th>
                            <th>Tax</th>
                            <th>Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxByDate.map((row) => (
                            <tr key={row.date}>
                                <td>{row.date}</td>
                                <td>₹{row.taxableSales.toFixed(2)}</td>
                                <td className="green">₹{row.tax.toFixed(2)}</td>
                                <td>{row.transactions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section >
        </main >
    );
};

export default ManagerReports;
