const express = require("express");
const dfd = require("danfojs-node");
const export_file = express();
export_file.use(express.json());

async function saveFile(df, files_type) {
  try {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const fileName = `sample_${timestamp}`;
    if (files_type === "xlsx") {
      dfd.toExcel(df, {
        filePath: `../storage/dataset/${fileName}.${files_type}`,
      });
    } else if (files_type === "csv") {
      dfd.toCSV(df, {
        filePath: `../storage/dataset/${fileName}.${files_type}`,
      });
    }
    return fileName; // Return the generated file name
  } catch (error) {
    console.error("Error saving file:", error);
    throw error; // Rethrow the error so it can be caught in the calling function
  }
}

export_file.post("/export/data", async (req, res) => {
  try {
    let dataSet = req.body.dataset;
    let files_type = req.body.files_type === "excel" ? "xlsx" : "csv";
    const df = new dfd.DataFrame(dataSet);
    const fileName = await saveFile(df, files_type);

    res.status(200).json({ message: `File exported as ${fileName}` });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = export_file;
