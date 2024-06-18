import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";

// Function to generate the PDF
async function generatePDF(supplier, evaluate_date, questionaire) {
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
    top: 0,
    margin: 0,
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
    margin: { left: width-75 },
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
  doc.text(`ประจำเดือน : ${formattedDate}`, width - 60, 50);
  doc.text(`หน่วยงาน / แผนก : ${supplier}`, 15, 50);
  doc.text(`ชื่อผู้ส่งมอบ :`, 15, 60);

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

  // Save the PDF
  doc.save(`evaluate_${supplier}.pdf`);
}
export default generatePDF;