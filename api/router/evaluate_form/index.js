const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const NodeCache = require("node-cache");
const evaluate_form = express();
evaluate_form.use(express.json());

//initial variable
const cache = new NodeCache({ stdTTL: 60 });
// display all questionaire
evaluate_form.get("/evaluate/topic", authenticateToken, async (req, res) => {
  try {
    const cacheKey = "evaluate_topic";
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.status(200).send(cachedData);
    } else {
      const sql = await sql_serverConn();
      const result = sql.query(
        `
        SELECT
        [TOPIC_NAME_TH],
        [TOPIC_NAME_EN],
        [HEADER_INDEX]
          , [TOPIC_HEADER_NAME_TH]
          , [TOPIC_HEADER_NAME_ENG]
          , [TOPIC_KEY_ID]
          , [TOPIC_LINE]
          , CONCAT([TOPIC_NAME_TH], ' (', [TOPIC_NAME_EN], ')') as TOPIC_NAME  
          , [CREATED_DATE]
          , [ACTIVE_DATE_FROM]
          , [ACTIVE_DATE_TO]
        FROM [dbo].[PECTH_EVALUATION_MASTER]
        `
      );
      cache.set(cacheKey, result.recordset);
      res.status(200).send((await result).recordset);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// insert into PECTH_EVALUATION_SCORE_HEADER & PECTH_EVALUATION_SCORE_DETAIL
evaluate_form.post(
  "/evaluate/sending_form",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const {
        supplier,
        evaluate_date,
        comments,
        eval_form,
        full_score,
        flag_status,
      } = req.body;
      const totalEntries = eval_form.length;
      const totalScore = eval_form.reduce(
        (sum, form) => sum + form.EVALUATE_TOPIC_SCORE,
        0
      );
      // Fetch the latest ID
      const latestIdResult = await sql.query(
        `SELECT MAX(EVALUATE_ID) as LatestID FROM dbo.[PECTH_EVALUATION_SCORE_HEADER]`
      );
      let latestId = latestIdResult.recordset[0].LatestID;
      let id = latestId ? parseInt(latestId.split("_")[1], 10) : 0;
      id++;
      const EVALUATE_ID = `evaluation_${String(id).padStart(4, "0")}`;
      // Prepare headers insertion query
      const headersQuery = `
      INSERT INTO dbo.[PECTH_EVALUATION_SCORE_HEADER]
      ([EVALUATE_ID], [SUPPLIER], [DEPARTMENT], [EVALUATE_DATE], [EVALUATE_TOTAL_SCORE], [EVALUATE_FULL_SCORE], [EVALUATE_PERCENT], [EVALUATE_GRADE], [EVALUATE_COMMENT], [SUBMIT_FORM_DATE], [FLAG_STATUS])
      VALUES (@EVALUATE_ID, @SUPPLIER, @DEPARTMENT, @EVALUATE_DATE, @EVALUATE_TOTAL_SCORE, @EVALUATE_FULL_SCORE, @EVALUATE_PERCENT, @EVALUATE_GRADE, @EVALUATE_COMMENT, GETDATE(), @FLAG_STATUS)
    `;
      const request = sql.request();
      // Insert headers outside loop
      request.input("EVALUATE_ID", EVALUATE_ID);
      request.input("SUPPLIER", supplier);
      request.input("DEPARTMENT", "Store PC");
      request.input("EVALUATE_DATE", evaluate_date);
      request.input("EVALUATE_TOTAL_SCORE", totalScore);
      request.input("EVALUATE_FULL_SCORE", full_score);
      let evaluatePercent = (totalScore / full_score) * 100;
      request.input("EVALUATE_PERCENT", evaluatePercent);
      request.input(
        "EVALUATE_GRADE",
        evaluatePercent <= 69
          ? "D"
          : evaluatePercent <= 79
          ? "C"
          : evaluatePercent <= 89
          ? "B"
          : "A"
      );
      request.input("EVALUATE_COMMENT", comments);
      request.input("FLAG_STATUS", flag_status);
      await request.query(headersQuery);
      // Insert details inside loop
      for (let i = 0; i < totalEntries; i++) {
        const { HEADER_INDEX, TOPIC_KEY_ID, EVALUATE_TOPIC_SCORE } =
          eval_form[i];
        // Create new request object for each detail insertion
        const detailRequest = sql.request();
        detailRequest.input("EVALUATE_ID", EVALUATE_ID);
        detailRequest.input("HEADER_INDEX", HEADER_INDEX); // Corrected here
        detailRequest.input("TOPIC_KEY_ID", TOPIC_KEY_ID);
        detailRequest.input("SUPPLIER", supplier);
        detailRequest.input("DEPARTMENT", "Store PC");
        detailRequest.input("EVALUATE_DATE", evaluate_date);
        detailRequest.input("EVALUATE_TOPIC_SCORE", EVALUATE_TOPIC_SCORE);
        await detailRequest.query(`
          INSERT INTO dbo.[PECTH_EVALUATION_SCORE_DETAIL]
          ([EVALUATE_ID], [HEADER_INDEX], [TOPIC_KEY_ID], [SUPPLIER], [DEPARTMENT], [EVALUATE_DATE], [EVALUATE_TOPIC_SCORE], [SUBMIT_FORM_DATE])
          VALUES (@EVALUATE_ID, @HEADER_INDEX, @TOPIC_KEY_ID, @SUPPLIER, @DEPARTMENT, @EVALUATE_DATE, @EVALUATE_TOPIC_SCORE, GETDATE())
        `);
      }

      res.status(200).send("Data inserted successfully");
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Evaluation FORM of Draft
evaluate_form.get("/evaluate/draft", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const result = await request.query(
      `
        SELECT
            upper(a.[EVALUATE_ID]) as EVALUATE_ID,
            a.[SUPPLIER],
            a.[EVALUATE_DATE],
            CONCAT(
                COUNT(CASE WHEN b.EVALUATE_TOPIC_SCORE != 0 THEN 1 END), 
                '/', 
                COUNT(*)
            ) AS 'EVALUATED AMOUNT',
            a.[FLAG_STATUS]
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER] a
            JOIN [dbo].[PECTH_EVALUATION_SCORE_DETAIL] b
            ON a.EVALUATE_ID = b.EVALUATE_ID
        GROUP BY a.[EVALUATE_ID], 
                a.[SUPPLIER], 
                a.[EVALUATE_DATE], 
                a.[FLAG_STATUS]
        HAVING LOWER(a.FLAG_STATUS) = 'draft'
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Evaluation FORM of Confirm
evaluate_form.get("/evaluate/confirm", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const result = await request.query(
      `
        SELECT
            upper(a.[EVALUATE_ID]) as EVALUATE_ID,
            a.[SUPPLIER],
            a.[EVALUATE_DATE],
            CONCAT(
                COUNT(CASE WHEN b.EVALUATE_TOPIC_SCORE != 0 THEN 1 END), 
                '/', 
                COUNT(*)
            ) AS 'EVALUATED AMOUNT',
            a.[FLAG_STATUS]
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER] a
            JOIN [dbo].[PECTH_EVALUATION_SCORE_DETAIL] b
            ON a.EVALUATE_ID = b.EVALUATE_ID
        GROUP BY a.[EVALUATE_ID], 
                a.[SUPPLIER], 
                a.[EVALUATE_DATE], 
                a.[FLAG_STATUS]
        HAVING LOWER(a.FLAG_STATUS) = 'confirm'
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//display SUMMARY SCORE
evaluate_form.get(
  "/evaluate/summary_score",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();
      const result = await request.query(
        `
        SELECT
          UPPER(EVALUATE_ID) as EVALUATE_ID, 
          SUPPLIER, 
          ROUND(EVALUATE_PERCENT, 2) as EVALUATE_PERCENT,
          EVALUATE_GRADE, 
          EVALUATE_COMMENT
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER]
        GROUP BY EVALUATE_ID, SUPPLIER, EVALUATE_PERCENT, EVALUATE_GRADE, EVALUATE_COMMENT
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display for using to update evaluateForm
evaluate_form.post(
  "/evaluate/update_form",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();
      const { eva_id, supplier, evaluate_date, flag_status } = req.body;
      request.input("id", eva_id);
      request.input("supplier", supplier);
      request.input("status", flag_status);
      request.input("evaluate_date", evaluate_date);
      const result = await request.query(
        `
        SELECT distinct a.HEADER_INDEX, a.TOPIC_KEY_ID, c.TOPIC_NAME_TH, c.TOPIC_NAME_EN, a.EVALUATE_TOPIC_SCORE, b.FLAG_STATUS, max(b.EVALUATE_DATE) as EVALUATE_DATE
        FROM [dbo].[PECTH_EVALUATION_SCORE_DETAIL] a
          LEFT JOIN dbo.[PECTH_EVALUATION_SCORE_HEADER] b
          ON a.EVALUATE_ID = b.EVALUATE_ID
          LEFT JOIN dbo.[PECTH_EVALUATION_MASTER] c
          ON a.TOPIC_KEY_ID = c.TOPIC_KEY_ID
        GROUP BY a.HEADER_INDEX, a.TOPIC_KEY_ID, a.EVALUATE_ID, a.SUPPLIER, b.FLAG_STATUS, b.EVALUATE_DATE, c.TOPIC_NAME_TH, c.TOPIC_NAME_EN, a.EVALUATE_TOPIC_SCORE, b.FLAG_STATUS
        HAVING a.EVALUATE_ID = @id AND LOWER(a.SUPPLIER) = @supplier AND LOWER(b.FLAG_STATUS) = @status AND b.EVALUATE_DATE = @evaluate_date
        ORDER BY a.TOPIC_KEY_ID
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// evalueForm for PDF
evaluate_form.post("/evaluate/generate_pdf", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const { supplier, evaluate_date, flag_status } = req.body;
    request.input("supplier", String(supplier).toLowerCase());
    request.input("evaluate_date", evaluate_date);
    request.input("status", flag_status);
    const result = await request.query(
      `
      SELECT
          DISTINCT
          a.TOPIC_NAME_TH,
          a.TOPIC_NAME_EN,
          b.EVALUATE_TOPIC_SCORE,
          a.TOPIC_HEADER_NAME_TH,
          a.TOPIC_HEADER_NAME_ENG,
          a.HEADER_INDEX, a.TOPIC_LINE
      FROM [dbo].PECTH_EVALUATION_MASTER a
          JOIN dbo.PECTH_EVALUATION_SCORE_DETAIL b
          ON a.TOPIC_KEY_ID = b.TOPIC_KEY_ID
          JOIN dbo.PECTH_EVALUATION_SCORE_HEADER c
          ON b.EVALUATE_ID = c.EVALUATE_ID
      GROUP BY a.HEADER_INDEX, a.TOPIC_LINE, c.EVALUATE_ID, a.TOPIC_NAME_TH,a.TOPIC_NAME_EN,b.EVALUATE_TOPIC_SCORE,a.TOPIC_HEADER_NAME_TH,a.TOPIC_HEADER_NAME_ENG, c.FLAG_STATUS, c.SUPPLIER, convert(nvarchar(10), b.EVALUATE_DATE, 120)
      HAVING LOWER(c.FLAG_STATUS)=@status and LOWER(c.SUPPLIER)=@supplier AND convert(nvarchar(10), b.EVALUATE_DATE, 120)=convert(nvarchar(10), @evaluate_date, 120)
      ORDER BY a.HEADER_INDEX, a.TOPIC_LINE
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = evaluate_form;
