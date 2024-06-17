import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../../tahoma-normal";
import schema from "../../print_schema";

// Function to generate the PDF
async function generatePDF(supplier, evaluate_date, questionaire) {
  const date = new Date(evaluate_date);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
  const day = String(date.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const doc = new jsPDF("l", "mm", "a4");
  const width = doc.internal.pageSize.getWidth();

  doc.addFileToVFS("tahoma.ttf", font);
  doc.addFont("tahoma.ttf", "tahoma", "normal");
  doc.setFont("tahoma");

  // Titles
  doc.setFontSize(20);
  doc.setFont("tahoma", "bold");
  doc.text(`Panasonic Energy (Thailand) Co.,Ltd.`, width / 2, 30, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setFont("tahoma", "normal");
  doc.text(
    "การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ",
    15,
    50
  );

  doc.setFontSize(12);
  doc.setFont("tahoma", "normal");
  doc.text(`หน่วยงาน / แผนก : ${supplier}`, 15, 65);
  doc.text(`ประจำเดือน : ${formattedDate}`, width - 70, 65);
  doc.text(`ชื่อผู้ส่งมอบ :`, 15, 75);

  // Group topics by HEADER_INDEX
  const groupedTopics = questionaire.reduce((groups, item) => {
    const index = item.HEADER_INDEX;
    if (!groups[index]) {
      groups[index] = [];
    }
    groups[index].push(item);
    return groups;
  }, {});

  let startY = 85; // Initial Y position for table

  doc.text("ระดับความพึงพอใจ (Satisfaction Level)", width - 85, 90);

  // Iterate over each group and create a table for each
  Object.keys(groupedTopics).forEach((headerIndex) => {
    const topics = groupedTopics[headerIndex];
    const headerName = groupedTopics[headerIndex][0].TOPIC_HEADER_NAME_TH;
    const headerScore = topics[0].EVALUATE_TOPIC_SCORE;
    startY += 10;

    // Prepare table content
    const tableData = groupedTopics[headerIndex].map((topic, index) => ({
      "หัวข้อประเมิน Assessment topic":
        `${topic.TOPIC_HEADER_NAME_TH}\n` +
        `${(index += 1)}. ` +
        topic.TOPIC_NAME_TH +
        `   (${topic.TOPIC_NAME_EN})`,
      1: topic.EVALUATE_TOPIC_SCORE === 1 ? "●" : "",
      2: topic.EVALUATE_TOPIC_SCORE === 2 ? "●" : "",
      3: topic.EVALUATE_TOPIC_SCORE === 3 ? "●" : "",
      4: topic.EVALUATE_TOPIC_SCORE === 4 ? "●" : "",
      5: topic.EVALUATE_TOPIC_SCORE === 5 ? "●" : "",
    }));

    // Create table
    doc.autoTable({
      startY: startY,
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
        fontSize: 9,
        font: "tahoma",
      },
      headStyles: { fillColor: [0, 57, 107], font: "tahoma", fontSize: 9 }, // Customize header style if needed
      margin: { left: 15, right: 15 },
    });

    // Update startY for the next table
    startY = doc.autoTable.previous.finalY + 10;

    // Add a new page if necessary
    if (startY > 270) {
      startY = 20; // Reset Y position on new page
    }
  });

  // Save the PDF
  doc.save(`evaluate_${supplier}.pdf`);
}

export default generatePDF;
