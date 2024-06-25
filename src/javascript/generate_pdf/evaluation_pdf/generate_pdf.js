import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";

// Function to generate the PDF
async function generatePDF(supplier, evaluate_date, department, questionaire) {
  // Date formatting
  const date = new Date(evaluate_date);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

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
    ["REVIEWER", "PIC"], // Header row
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
    didParseCell: function (data) {
      if (data.row.raw.every(cell => cell === "")) {
        data.cell.styles.minCellHeight = 10;
      } else {
        data.cell.styles.minCellHeight = 5;
      }
    },
  });

  // Texts below the table
  doc.text(`ประจำเดือน : ${formattedDate}`, width - 60, 50);
  doc.text(`หน่วยงาน / แผนก : ${String(department).toUpperCase()}`, 15, 50);
  doc.text(`ชื่อผู้ส่งมอบ : ${String(supplier).toUpperCase()}`, 15, 60);

  // Group topics by TOPIC_HEADER_NAME_TH
  const groupedTopics = questionaire.reduce((groups, item) => {
    const headerName =
      item.TOPIC_HEADER_NAME_TH + " / " + item.TOPIC_HEADER_NAME_ENG;
    if (!groups[headerName]) {
      groups[headerName] = [];
    }
    groups[headerName].push(item);
    return groups;
  }, {});

  // Prepare table content
  const tableData = [];
  let questionCounter = 1;

  Object.keys(groupedTopics).forEach((headerName) => {
    const topics = groupedTopics[headerName];
    tableData.push({
      "หัวข้อประเมิน Assessment topic": `${headerName}`,
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
    });
    topics.forEach((topic) => {
      tableData.push({
        "หัวข้อประเมิน Assessment topic":
          `${topic.TOPIC_LINE}. ` +
          topic.TOPIC_NAME_TH +
          `\n(${topic.TOPIC_NAME_EN})`,
        1: topic.EVALUATE_TOPIC_SCORE === 1 ? "●" : "",
        2: topic.EVALUATE_TOPIC_SCORE === 2 ? "●" : "",
        3: topic.EVALUATE_TOPIC_SCORE === 3 ? "●" : "",
        4: topic.EVALUATE_TOPIC_SCORE === 4 ? "●" : "",
        5: topic.EVALUATE_TOPIC_SCORE === 5 ? "●" : "",
      });
      questionCounter++;
    });
  });

  // Create table
  const headers = [
    [
      { content: "หัวข้อประเมิน Assessment topic", rowSpan: 2 },
      {
        content: "ระดับความพึงพอใจ (Satisfaction Level)",
        styles: { fontSize: 8 },
        colSpan: 5,
      },
    ],
    ["1", "2", "3", "4", "5"],
  ];

  doc.autoTable({
    startY: 70,
    head: headers,
    body: tableData,
    columns: [
      {
        header: "หัวข้อประเมิน Assessment topic",
        dataKey: "หัวข้อประเมิน Assessment topic",
      },
      { header: "1", dataKey: 1 },
      { header: "2", dataKey: 2 },
      { header: "3", dataKey: 3 },
      { header: "4", dataKey: 4 },
      { header: "5", dataKey: 5 },
    ],
    theme: "grid",
    styles: {
      fontSize: 9.3,
      font: "tahoma",
    },
    headerStyles: {
      fillColor: "#016255",
      font: "tahoma",
      fontSize: 9,
    },
    margin: { left: 15, right: 15 },
  });

  // Calculate total score based on EVALUATE_TOPIC_SCORE
  const totalScore = questionaire.reduce((total, topic) => {
    if (topic.EVALUATE_TOPIC_SCORE) {
      return total + parseInt(topic.EVALUATE_TOPIC_SCORE);
    }
    return total;
  }, 0);

  // Calculate total percentage based on EVALUATE_PERCENT
  const totalPercentage = questionaire[0]?.EVALUATE_PERCENT.toFixed(3);
  let grade = "";

  if (totalPercentage >= 90 && totalPercentage < 100) {
    grade += "A ดีมาก";
  } else if (totalPercentage >= 80 && totalPercentage < 89) {
    grade += "B ดี";
  } else if (totalPercentage >= 70 && totalPercentage < 79) {
    grade += "C พอใช้";
  } else {
    grade += "D ควรปรับปรุง";
  }

  // Print total score and total percentage
  doc.setFontSize(11);
  doc.setFont("tahoma", "normal");
  doc.text(
    `คะแนนรวม  / Total Score:  ${totalScore} คะแนน`,
    15,
    doc.autoTable.previous.finalY + 10
  );
  doc.text(
    `คะแนนรวม (%) : ${totalPercentage}% (${grade})`,
    15,
    doc.autoTable.previous.finalY + 15
  );

  const pageHeight = doc.internal.pageSize.height;
  let startYComment = doc.autoTable.previous.finalY + 20;

  // Check if we need a new page for the comment
  if (startYComment > pageHeight - 30) {
    doc.addPage();
    startYComment = 20;
  }

  // Print comment
  doc.text(
    `ข้อเสนอแนะ ( Comment ): ${questionaire[0]?.EVALUATE_COMMENT}`,
    15,
    startYComment
  );

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

  const startYGradeCondition = startYComment + 10;
  doc.autoTable({
    startY: startYGradeCondition,
    head: gradeConditionHeaders,
    body: gradeConditionBody,
    styles: {
      lineColor: [0, 0, 0], // Black border color
      halign: "center",
      font: "tahoma",
      lineWidth: 0.1,
    },
    headerStyles: {
      fillColor: ["white"], // White background for headers
      textColor: ["black"], // Black text for headers
      fontSize: 10,
      lineWidth: 0.1,
    },
  });

  // Save the PDF
  doc.save(`evaluate_${supplier}.pdf`);
}

export default generatePDF;