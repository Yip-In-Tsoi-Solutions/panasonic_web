import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";

async function generatePDF(data, fileName) {
  try {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const current_date = `${day}/${month}/${year}`;

    // Paper Setting
    const doc = new jsPDF("l", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Embedding custom font
    doc.addFileToVFS("tahoma.ttf", font);
    doc.addFont("tahoma.ttf", "tahoma", "normal");
    doc.setFont("tahoma");

    // Add whitespace
    doc.text("", 10, 10); // Adjust position as needed
    doc.text("", 10, 20); // Adjust position as needed

    const table1Data = [
      [
        {
          content: "Purchasing Department",
          colSpan: 3,
          styles: { halign: "center", fillColor: [255, 255, 255] },
        },
      ],
      ["GM", "MG", "PIC"], // Header row
      ["", "", ""], // Empty row, you can remove this line if you don't need it
    ];

    const table2Data = [
      [
        {
          content: "Accounting Department",
          colSpan: 3,
          styles: { halign: "center", fillColor: [255, 255, 255] },
        },
      ],
      ["FD", "MG", "PIC"], // Header row
      ["", "", ""], // Empty row, you can remove this line if you don't need it
    ];

    // Define column widths
    const columnWidth1 = 70 / 3; // Assuming 3 columns
    const columnWidth2 = 70 / 3; // Assuming 3 columns

    // Define starting positions for the tables
    const startX1 = 10; // Adjust as needed
    const startY = 10; // Adjust as needed

    // Create table 1
    doc.setFontSize(10);
    doc.autoTable({
      startY: startY,
      margin: { left: startX1 },
      body: table1Data,
      columnStyles: {
        0: { columnWidth: columnWidth1, halign: "center", lineWidth: 0.1 }, // GM
        1: { columnWidth: columnWidth1, halign: "center", lineWidth: 0.1 }, // MG
        2: { columnWidth: columnWidth1, halign: "center", lineWidth: 0.1 }, // PIC
      },
      styles: {
        lineColor: [0, 0, 0], // Black border color
        fillColor: [255, 255, 255], // White background color
        halign: "center",
      },
    });

    // Define starting positions for the tables
    const startX2 = startX1 + 195 + 10; // Adjust as needed

    // Create table 2
    doc.autoTable({
      startY: startY,
      margin: { left: startX2 },
      body: table2Data,
      columnStyles: {
        0: { columnWidth: columnWidth2, halign: "center", lineWidth: 0.1 },
        1: { columnWidth: columnWidth2, halign: "center", lineWidth: 0.1 },
        2: { columnWidth: columnWidth2, halign: "center", lineWidth: 0.1 },
      },
      styles: {
        lineColor: [0, 0, 0], // Black border color
        halign: "center",
      },
    });

    // Titles
    doc.setFontSize(20);
    doc.setFont("tahoma", "bold");
    doc.text("BUYER REASON REPORT", width / 2, 60, {
      align: "center",
    });
    doc.setFontSize(18);
    doc.text(`AS OF ${current_date}`, width / 2, 70, {
      align: "center",
    });

    // Mapping data to table and calculating grand totals
    let totalQtyReceived = 0;

    const dataTable = data.map((item) => {
      const qtyReceived = parseFloat(item?.QUANTITY_RECEIVED) || 0;
      totalQtyReceived += qtyReceived;
      return {
        supplier: item?.SUPPLIER,
        po_number: item?.PO_NUMBER,
        po_release: item?.PO_RELEASE,
        item: item?.ITEM_NO,
        item_desc: item?.ITEM_DESCRIPTION,
        qty_received: qtyReceived,
        buyer: item?.BUYER,
        remark: item?.REASON,
      };
    });

    // Add the GRAND TOTAL row
    dataTable.push({
      supplier: "GRAND TOTAL",
      po_number: "",
      po_release: "",
      item: "",
      item_desc: "",
      qty_received: totalQtyReceived,
      buyer: "",
      remark: "",
    });

    // Generating data table
    doc.autoTable({
      startY: 80,
      body: dataTable,
      columns: schema(dataTable),
      styles: {
        fontSize: 6,
        font: 'tahoma'
      },
      headerStyles: {
        fillColor: "#016255",
        font: "tahoma",
        fontSize: 5,
      },
      didDrawCell: function (data) {
        if (data.row.raw.supplier === "GRAND TOTAL") {
          doc.setFontSize(10);
          doc.setFont("tahoma", "bold");
          doc.setTextColor(255, 0, 0); // Red color for the grand total row
        }
      },
    });

    // Saving the PDF
    doc.save(`${fileName}_${current_date}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error); // Log the error
  }
}

export default generatePDF;
