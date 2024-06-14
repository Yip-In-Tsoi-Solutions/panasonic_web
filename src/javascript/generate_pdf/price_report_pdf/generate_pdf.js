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
    doc.text("ANALYSIS FOR PRICE DIF REPORT", width / 2, 60, {
      align: "center",
    });
    doc.setFontSize(18);
    doc.text(`AS OF ${current_date}`, width / 2, 70, {
      align: "center",
    });

    // Mapping data to table
    const dataTable = data.map((item) => ({
      supplier: item?.VENDOR_NAME,
      invoice_no: item?.INVOICE_NUM,
      invoice_date: item?.INVOICE_DATE,
      po_release: `${item?.PO_NUMBER}/${item?.RELEASE_NUM}`, // Combined PO_NUMBER and RELEASE_NUM
      item: item?.ITEM,
      description: item?.DESCRIPTION,
      uom: item?.UOM,
      QTY_ORDER: item?.PO_QTY,
      QTY_RECEIVED: item?.INV_QTY,
      PO_PRICE: item?.PO_UNIT_PRICE ? item.PO_UNIT_PRICE.toFixed(3) : "0.000",
      INVOICE_PRICE: item?.INV_UNIT_PRICE
        ? item.INV_UNIT_PRICE.toFixed(3)
        : "0.000",
      DIFF: item?.PO_INVOICE_DIFF ? item.PO_INVOICE_DIFF : 0,
      DIFF_AMOUNT: item?.PO_ITEM_COST_DIFF ? item.PO_ITEM_COST_DIFF : 0,
      currency: item?.INV_CURRENCY_CODE,
      buyer: item?.BUYER,
      remark: item?.REMARK,
    }));

    // Generating data table
    const totals = dataTable.reduce(
      (acc, item) => {
        acc.PO_PRICE += parseFloat(item.PO_PRICE) || 0;
        acc.INVOICE_PRICE += parseFloat(item.INVOICE_PRICE) || 0;
        acc.PO_INVOICE_DIFF += item.PO_INVOICE_DIFF || 0;
        acc.PO_ITEM_COST_DIFF += item.PO_ITEM_COST_DIFF || 0;
        return acc;
      },
      {
        PO_PRICE: 0,
        INVOICE_PRICE: 0,
        PO_INVOICE_DIFF: 0,
        PO_ITEM_COST_DIFF: 0,
      }
    );

    doc.autoTable({
      startY: 80,
      body: dataTable,
      columns: schema(dataTable),
      styles: {
        fontSize: 6,
        font: "tahoma",
      },
      headerStyles: {
        fillColor: "#016255",
        font: "tahoma",
        fontSize: 6,
      },
    });

    // Displaying totals
    doc.setFontSize(10);
    const total =
      totals.PO_PRICE +
      totals.INVOICE_PRICE +
      totals.PO_INVOICE_DIFF +
      totals.PO_ITEM_COST_DIFF;

    const vat = total * 0.07;
    doc.text(
      `
      TOTAL: ${total.toFixed(3)}`,
      10,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `
      VAT 7%: ${(vat).toFixed(3)}`,
      10,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `
      GRAND TOTAL: ${(total + vat).toFixed(3)}`,
      10,
      doc.lastAutoTable.finalY + 30
    );
    // Saving the PDF
    doc.save(`${fileName}_${current_date}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error); // Log the error
  }
}

export default generatePDF;
