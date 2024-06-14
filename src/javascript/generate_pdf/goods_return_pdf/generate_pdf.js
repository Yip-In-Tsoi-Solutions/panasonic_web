import jsPDF from "jspdf";
import "jspdf-autotable";
import schema from "../../print_schema";
import { font } from "../../tahoma-normal";

async function generatePDF(dataset, supplierName, fileName, return_doc) {
  try {
    const doc = new jsPDF("l", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();
    const margin = 15; // Set the margin
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const createForm_date = `${day}/${month}/${year}`;

    // Data in Table
    const dataTable = dataset.map((item) => ({
      "po number": item?.po_number,
      "po release": item?.po_release,
      "รหัสสินค้า\nitem_code": item?.item_no,
      "รายละเอียดข้อมูล\ndescription": item?.description,
      "หน่วย\nunit": item?.unit,
      "จำนวน\nQuantity": item?.return_qty,
      "ราคาต่อหน่วย\nunitPrice": item?.unitPrice,
      "บาท\nBATH": parseFloat(item?.return_qty * item?.unitPrice).toFixed(2),
      "สาเหตุ\ncause": item?.cause,
      "อ้างอิงถึงใบกำกับภาษี\ninvoice_number": item?.invoice_no,
    }));

    // Calculate totals and VAT
    const total = dataTable.reduce(
      (sum, item) => sum + parseFloat(item["บาท\nBATH"]),
      0
    );
    const vat = total * 0.07;
    const grandTotal = total + vat;

    // Embedding custom font
    doc.addFileToVFS("tahoma.ttf", font);
    doc.addFont("tahoma.ttf", "tahoma", "normal");
    doc.setFont("tahoma");

    const addLeftAlignedText = (text, x, y) => {
      doc.text(text, x, y);
    };

    doc.setFontSize(14);
    doc.text("ใบคืนสินค้าในประเทศ", width / 2, margin, { align: "center" });

    doc.setFontSize(18);
    doc.text("GOODS RETURN TO SUPPLIER".toUpperCase(), width / 2, margin + 10, {
      align: "center",
    });

    doc.setFontSize(10);
    // addLeftAlignedText(`ออกโดย / issued by`, margin, margin + 30);
    addLeftAlignedText(
      `Panasonic Energy (Thailand) Co.,Ltd.`.toUpperCase(),
      width - margin - 100,
      margin + 30
    );
    addLeftAlignedText(`คืนให้สินค้า  ${supplierName}`, margin, margin + 40);
    addLeftAlignedText(
      `วันที่คืนสินค้า (DATE) ${createForm_date}`.toUpperCase(),
      width - margin - 100,
      margin + 40
    );
    addLeftAlignedText(
      `เลขที่ใบคืนสินค้า (Return ID) ${return_doc}`.toUpperCase(),
      width - margin - 100,
      margin + 50
    );
    // addLeftAlignedText(
    //   `วันที่คืนสินค้า (DATE) ${createForm_date}`.toUpperCase(),
    //   margin,
    //   margin + 50
    // );
    // addLeftAlignedText(
    //   `${createForm_date}`.toUpperCase(),
    //   width - margin - 100,
    //   margin + 50
    // );
    // addLeftAlignedText(
    //   `เลขที่ใบคืนสินค้า (Return ID) ${return_doc}`.toUpperCase(),
    //   margin,
    //   margin + 60
    // );
    // addLeftAlignedText(return_doc, width - margin - 100, margin + 60);

    // Calculate startY based on the margins
    const startY = margin + 66;

    // Render the table
    doc.setFont("tahoma", "normal");
    doc.autoTable({
      startY: startY,
      margin: { left: margin, right: margin },
      body: dataTable,
      columns: schema(dataTable),
      styles: {
        fontSize: 7,
        font: "tahoma",
      },
      headerStyles: {
        fillColor: "#016255",
        font: "tahoma",
        fontSize: 7,
      },
      pageBreak: "auto",
      tableWidth: "auto",
      showHead: "firstPage",
      theme: "striped",
    });

    const finalY = doc.autoTable.previous.finalY; // Reduced space between table and totals

    // Add total, VAT, and grand total below the table
    doc.setFontSize(9);
    doc.setFont("tahoma", "bold");
    doc.text(`SUBTOTAL:   ${total.toFixed(2)} / BATH`, margin, finalY + 10);
    doc.text(`VAT 7%:   ${vat.toFixed(2)} / BATH`, margin + 60, finalY + 10); // Positioned next to TOTAL
    doc.text(
      `GRAND TOTAL:   ${grandTotal.toFixed(2)} / BATH`,
      margin + 120,
      finalY + 10
    );
    doc.setFontSize(9);
    doc.setFont("tahoma", "normal");
    const sign_here = "..........................................";
    const signatureSpacing = 20; // Reduced spacing between each signature line

    // Add sign lines with adjusted positions
    const signatureMargin = margin; // Increased margin for signatures
    const rightSignatureMargin = width - margin - 120; // Adjusted right margin for better alignment
    const signatureY = finalY + 30; // Reduced white space before signatures

    // Left column signatures
    doc.text(
      `${sign_here}\nผู้อนุมัติ (Approved By)`,
      signatureMargin,
      signatureY
    );
    doc.text(
      `${sign_here}\nผู้ออกเอกสาร (PIC.)`,
      signatureMargin,
      signatureY + signatureSpacing
    );
    doc.text(
      `${sign_here}\nผู้ขาย (Supplier Accept)`,
      signatureMargin,
      signatureY + signatureSpacing * 2
    );

    // Right column signatures
    doc.text(
      `${sign_here}\nผู้รับคืน / วันที่ (Receiver)`,
      rightSignatureMargin,
      signatureY
    );
    doc.text(
      `${sign_here}\nทะเบียนรถ (Car Registration no.)`,
      rightSignatureMargin,
      signatureY + signatureSpacing
    );
    doc.text(
      `${sign_here}\nผู้ส่งคืน / วันที่\nReturn data (Store Keeper)`,
      rightSignatureMargin,
      signatureY + signatureSpacing * 2
    );

    // Save the PDF
    const safeFileName = `${supplierName.replace(/ /g, "_")}_${fileName.replace(
      / /g,
      "_"
    )}_${day}_${month}_${year}.pdf`;
    doc.save(safeFileName);
  } catch (error) {
    console.error("Error generating PDF: ", error);
  }
}

export default generatePDF;
