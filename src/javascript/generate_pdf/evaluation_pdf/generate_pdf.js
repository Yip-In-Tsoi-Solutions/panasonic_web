import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";

// Function to generate the PDF
async function generatePDF(supplier, evaluate_date, questionaire) {
  const date = new Date(evaluate_date);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
  const day = String(date.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const doc = new jsPDF("p", "mm", "a4");
  const width = doc.internal.pageSize.getWidth();

  doc.addFileToVFS("tahoma.ttf", font);
  doc.addFont("tahoma.ttf", "tahoma", "normal");
  doc.setFont("tahoma");

  // Titles
  doc.setFontSize(18);
  doc.setFont("tahoma", "bold");
  doc.text(`Panasonic Energy (Thailand) Co.,Ltd.`, width / 2, 15, {
    align: "center",
    top: 0,
    margin: 0
  });

  doc.setFontSize(11);
  doc.setFont("tahoma", "normal");
  doc.text(
    "การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ",
    15,
    30
  );

  doc.setFontSize(11);
  doc.setFont("tahoma", "normal");
  doc.text(`หน่วยงาน / แผนก : ${supplier}`, 15, 40);
  doc.text(`ประจำเดือน : ${formattedDate}`, width - 60, 40);
  doc.text(`ชื่อผู้ส่งมอบ :`, 15, 50);

  let startY = 55; // Initial Y position for table

  // doc.text("ระดับความพึงพอใจ (Satisfaction Level)", width - 85, 75);

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
  const uniqueHeaderNames = new Set();

  Object.keys(groupedTopics).forEach((headerName) => {
    uniqueHeaderNames.add(headerName);
    const topics = groupedTopics[headerName];
    tableData.push({
      "หัวข้อประเมิน Assessment topic": `${headerName}`,
      1: "",
      2: "",
      3: "",
      4: "",
      5: ""
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
    startY: startY,
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