import express from "express";
import sql_serverConn from "../../sql_server_conn/sql_serverConn.js";
const evaluate_form = express();
evaluate_form.use(express.json());
evaluate_form.get("/evaluate/topic", async (req, res) => {
  const data = [
    {
      title: "การส่งมอบสินค้าตรงเวลา",
    },
    {
      title: "การแต่งกายของเจ้าหน้าที่จัดส่งและความสุภาพ การปฏิบัติตนขณะขนส่ง",
    },
    {
      title:
        "ชนิดสินค้าและจำนวนถูกต้องมีการจัดเรียงสินค้าเป็นระเบียบเรียบร้อยเมื่อส่งมอบงาน",
    },
    {
      title: "เจ้าหน้าที่จัดส่งปฏิบัติตามกฏระบียบของบริษัทอย่างเคร่งครัด",
    },
    {
      title:
        "ลักษณะทางกายภาพของหีบห่อที่บรรจุสินค้า (เช่น ไม่มีรอยฉีกขาด เป็นต้น)",
    },
    {
      title: "ป้ายชื่อสินค้าถูกต้องตามมาตรฐาน,บรรจุหีบห่อถูกต้องตามข้อกำหนด",
    },
    {
      title: "ความรวดเร็วในการแก้ปัญหา",
    },
    {
      title: "ความสุภาพและการปฏิบัติของพนักงานบริษัท",
    },
    {
      title: "การเป็นที่ปรึกษาให้คำแนะนำด้านเทคนิคผลิตภัณฑ์",
    },
    {
      title: "ความสุภาพและการปฏิบัติของพนักงานขาย",
    },
    {
      title: "ความสม่ำเสมอในการติดต่อและบริการ เอกสารต่าง ๆ ที่เกี่ยวข้อง",
    },
    {
      title:
        "Certificate of Analysis [COA] (เช่น ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)",
    },
    {
      title:
        "Quotation (ใบเสนอราคา) (เช่น ความรวดเร็ว ความถูกต้อง ความครบถ้วน เป็นต้น)",
    },
    {
      title:
        "Invoice / เอกสารส่งมอบงาน (เช่น ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)",
    },
  ];
  res.status(200).send(data);
});
evaluate_form.post("/evaluate/sending_form", async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    request.query(
      `INSERT INTO Evaluation(comments, evaluate_date, total_score, score_percentage, supplier) VALUES(@comment_message, @evaluate_date, @evaluate_scoreTotal, @score_percentage, @supplier)`
    );
    const comments = req.body.comments;
    const evaluate_date = req.body.evaluate_date;
    const evaluate_scoreTotal = req.body.total_score;
    const score_percentage = req.body.score_percentage;
    const supplier = req.body.supplier;
    request.input("comment_message", comments);
    request.input("evaluate_date", evaluate_date);
    request.input("evaluate_scoreTotal", evaluate_scoreTotal);
    request.input("score_percentage", score_percentage);
    request.input("supplier", supplier);
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});
evaluate_form.get("/evaluate", async (req, res) => {
  const sql = await sql_serverConn();
  const request = sql.request();
  const result = await request.query(
    `
    SELECT
      supplier,
      comments,
      evaluate_date,
      total_score,
      ROUND(score_percentage, 2) as score_percentage,
      CASE
        WHEN ROUND(score_percentage, 2) BETWEEN 90 AND 100 THEN 'A'
            WHEN ROUND(score_percentage, 2) BETWEEN 80 AND 89 THEN 'B'
            WHEN ROUND(score_percentage, 2) BETWEEN 70 AND 79 THEN 'C'
            ELSE 'D'
      END AS grade
    FROM
      dbo.Evaluation
    order by grade asc
    `
  );
  res.status(200).send(result.recordset);
});
export default evaluate_form;
