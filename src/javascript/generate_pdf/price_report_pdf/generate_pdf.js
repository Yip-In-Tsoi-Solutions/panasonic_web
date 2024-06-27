import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";
import numberWithCommas from "../../numberWithCommas";
import moment from "moment";
async function generatePDF(data, fileName, price_report_date_from_to) {
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
        0: {
          columnWidth: columnWidth1,
          halign: "center",
          lineWidth: 0.1,
        }, // GM
        1: {
          columnWidth: columnWidth1,
          halign: "center",
          lineWidth: 0.1,
        }, // MG
        2: {
          columnWidth: columnWidth1,
          halign: "center",
          lineWidth: 0.1,
        }, // PIC
      },
      styles: {
        lineColor: [0, 0, 0], // Black border color
        fillColor: [255, 255, 255], // White background color
        halign: "center"
      },
      didParseCell: function (data) {
        if (data.row.raw.every(cell => cell === "")) {
          data.cell.styles.minCellHeight = 15;
        } else {
          data.cell.styles.minCellHeight = 5;
        }
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
      didParseCell: function (data) {
        if (data.row.raw.every(cell => cell === "")) {
          data.cell.styles.minCellHeight = 15;
        } else {
          data.cell.styles.minCellHeight = 5;
        }
      },
    });

    // Titles
    doc.setFontSize(20);
    doc.setFont("tahoma", "bold");
    doc.text("ANALYSIS FOR PRICE DIF REPORT", width / 2, 60, {
      align: "center",
    });
    doc.setFontSize(18);
    doc.text(`AS OF  ${price_report_date_from_to}`, width / 2, 70, {
      align: "center",
    });

    const dataTable = data.map((item) => ({
      supplier: item?.VENDOR_NAME,
      invoice_no: item?.INVOICE_NUM,
      invoice_date: moment(item?.INVOICE_DATE).format("YYYY-MM-DD"),
      po_number: item?.PO_NUMBER,
      po_release: `${item?.PO_NUMBER}/${item?.RELEASE_NUM}`, // Combined PO_NUMBER and RELEASE_NUM
      item: item?.ITEM,
      description: item?.DESCRIPTION,
      uom: item?.UOM,
      QTY_ORDER: numberWithCommas(item?.PO_QTY),
      QTY_RECEIVED: numberWithCommas(item?.INV_QTY),
      PO_PRICE: numberWithCommas(item.PO_UNIT_PRICE.toFixed(3)),
      INVOICE_PRICE: numberWithCommas(item.INV_UNIT_PRICE.toFixed(3)),
      DIFF: numberWithCommas(item?.DIFF),
      DIFF_AMOUNT_THB: numberWithCommas(item?.DIFF_AMOUNT_THB),
      currency: item?.INV_CURRENCY_CODE,
      buyer: item?.BUYER,
      remark: item?.REMARK,
    }));

    // Mapping data to table
    const findSum = data.map((item) => ({
      DIFF_AMOUNT_THB: item?.DIFF_AMOUNT_THB,
    }));

    // Generating data table
    const totals = findSum.reduce((acc, item) => {
      acc.DIFF_AMOUNT_THB += parseFloat(item.DIFF_AMOUNT_THB);
      return acc;
    });
    doc.autoTable({
      startY: 80,
      head: [
        [
          "vendor name".toUpperCase(),
          "invoice number".toUpperCase(),
          "invoice date".toUpperCase(),
          "po number".toUpperCase(),
          "po release".toUpperCase(),
          "item".toUpperCase(),
          "description".toUpperCase(),
          "uom".toUpperCase(),
          "qty order".toUpperCase(),
          "qty received".toUpperCase(),
          "po price".toUpperCase(),
          "invoice price".toUpperCase(),
          "diff".toUpperCase(),
          "diff amount (THB)".toUpperCase(),
          "currency".toUpperCase(),
          "buyer".toUpperCase(),
          "remark".toUpperCase(),
        ],
      ],
      body: dataTable,
      columns: schema(dataTable),
      styles: {
        fontSize: 5,
        font: "tahoma",
      },
      headerStyles: {
        fillColor: "#016255",
        font: "tahoma",
        fontSize: 5,
      },
    });

    if (height > 270) {
      doc.addPage();
    }

    // Displaying totals
    doc.setFontSize(10);
    const total = totals.DIFF_AMOUNT_THB;
    doc.setFont("tahoma", "bold");
    doc.text(
      `GRAND TOTAL:   ${numberWithCommas(total.toFixed(3))} THB`,
      width / 2,
      doc.lastAutoTable.finalY + 10,
      {
        align: "center",
      }
    );
    // Saving the PDF
    doc.save(`${fileName}_${current_date}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error); // Log the error
  }
}

export default generatePDF;
