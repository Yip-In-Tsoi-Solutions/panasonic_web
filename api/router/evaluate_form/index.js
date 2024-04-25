import express from "express";

const evaluate_form = express();
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
evaluate_form.post('/evaluate/sending_form', async (req, res)=> {
  const vendor = req.body.vendor;
  const evaluate_date = req.body.evaluate_date;
  const overall_score = req.body.overall_score;
  const comment = req.body.comments;

})
export default evaluate_form;
