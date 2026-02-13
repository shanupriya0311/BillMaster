import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Simple test component to verify jsPDF is working
const PDFTest = () => {
    const testPDF = () => {
        try {
            console.log("Creating PDF...");
            const doc = new jsPDF();

            console.log("jsPDF instance created:", doc);
            console.log("autoTable method exists:", typeof doc.autoTable);

            // Add simple text
            doc.setFontSize(18);
            doc.text("Test PDF", 14, 20);

            // Test autoTable
            doc.autoTable({
                startY: 30,
                head: [['Column 1', 'Column 2']],
                body: [
                    ['Row 1 Data 1', 'Row 1 Data 2'],
                    ['Row 2 Data 1', 'Row 2 Data 2']
                ],
                theme: 'grid',
                headStyles: { fillColor: [20, 184, 166] }
            });

            console.log("PDF created successfully!");
            doc.save("test.pdf");
            alert("PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Error: " + error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>PDF Export Test</h2>
            <button
                onClick={testPDF}
                style={{
                    padding: "10px 20px",
                    background: "#14b8a6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
            >
                Test PDF Export
            </button>
            <p>Check browser console for detailed logs</p>
        </div>
    );
};

export default PDFTest;
