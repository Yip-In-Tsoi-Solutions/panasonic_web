import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";

// Function to generate the PDF
async function Summary_score_pdf(data, summary_date) {

  // Create a new jsPDF document
  const doc = new jsPDF("p", "mm", "a4");
  const width = doc.internal.pageSize.getWidth();

  // Load and set custom font (Tahoma)
  doc.addFileToVFS("tahoma.ttf", font);
  doc.addFont("tahoma.ttf", "tahoma", "normal");
  doc.setFont("tahoma");

  // Document title and headers
  doc.setFontSize(18);
  doc.setFont("tahoma", "bold");
  doc.text(`Panasonic Energy (Thailand) Co.,Ltd.`, width / 2, 15, {
    align: "center",
  });
  doc.setFontSize(11);
  doc.setFont("tahoma", "normal");
  const titleText =
    "การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ";
  doc.text(titleText, 15, 30);

  // Table for REVIEWER and PIC
  const columnWidth2 = 60 / 2;
  const table2Data = [
    ["PM", "GM"], // Header row
    ["", ""], // Empty row, you can remove this line if you don't need it
  ];
  doc.autoTable({
    startY: 25,
    margin: { left: width - 75 },
    body: table2Data,
    columnStyles: {
      0: {
        columnWidth: columnWidth2,
        halign: "center",
        lineWidth: 0.1,
        fontSize: 8,
        fontWeight: "bold",
      },
      1: {
        columnWidth: columnWidth2,
        halign: "center",
        lineWidth: 0.1,
        fontSize: 8,
        fontWeight: "bold",
      },
    },
    styles: {
      lineColor: [0, 0, 0], // Black border color
      halign: "center",
    },
  });

  // Texts below the table
  doc.text(`ประจำเดือน : ${summary_date}`, width - 60, 50);
  //   doc.text(`หน่วยงาน / แผนก : ${String(department).toUpperCase()}`, 15, 50);
  //   doc.text(`ชื่อผู้ส่งมอบ : ${String(supplier).toUpperCase()}`, 15, 60);
  doc.setFont("tahoma", "normal");
  doc.autoTable({
    startY: 65,
    body: data,
    columns: schema(data),
    theme: "grid",
    styles: {
      fontSize: 7,
      font: "tahoma",
    },
    headerStyles: {
      fillColor: "#016255",
      font: "tahoma",
      fontSize: 8,
    },
    margin: { left: 15, right: 15 },
  });

  // Grade condition table
  const gradeConditionHeaders = [
    [
      {
        content: "เกณฑ์การให้คะแนน",
        colSpan: 3,
        styles: {
          halign: "center",
          fillColor: ["#f5f5f5"], // Gray background
          textColor: ["black"], // Black text
        },
      },
    ],
    ["เกรด", "คะแนน (%)", "ผลสรุป"], // Header row
  ];
  const gradeConditionBody = [
    ["A", "90-100", "ดีมาก"],
    ["B", "80-89", "ดี"],
    ["C", "70-79", "พอใช้"],
    ["D", "น้อยกว่า 70", "ควรปรับปรุง"],
  ];
  let startYComment = doc.autoTable.previous.finalY + 5;
  const startYGradeCondition = startYComment + 5;
  doc.autoTable({
    startY: startYGradeCondition,
    head: gradeConditionHeaders,
    body: gradeConditionBody,
    styles: {
      lineColor: [0, 0, 0], // Black border color
      halign: "center",
      font: "tahoma",
      lineWidth: 0.1,
      fontSize: 7,
    },
    headerStyles: {
      fillColor: ["white"], // White background for headers
      textColor: ["black"], // Black text for headers
      fontSize: 10,
      lineWidth: 0.1,
      fontSize: 8,
    },
  });

  // Save the PDF
  doc.save(`evaluate_summary_score.pdf`);
}

export default Summary_score_pdf;
