const express = require("express");
const sql_serverConn = require("../../sql_server_conn/sql_serverConn");
const authenticateToken = require("../../secure/jwt");
const evaluate_form = express();
evaluate_form.use(express.json());
//
evaluate_form.get(
  "/evaluate/dropdown/supplier",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const result = sql.query(
        `
        SELECT * FROM [dbo].[PECTH_SUPPLIER_MASTER] ORDER by SUPPLIER_NAME ASC
      `
      );
      res.status(200).send((await result).recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// display all questionaire
evaluate_form.get("/evaluate/topic", authenticateToken, async (req, res) => {
  try {
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
        FROM [dbo].[PECTH_EVALUATION_MASTER] WHERE SYSDATETIME() between ACTIVE_DATE_FROM and ACTIVE_DATE_TO
        ORDER BY TOPIC_KEY_ID asc
        `
    );
    res.status(200).send((await result).recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// create Evaluation data
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

      //
      const checked_month = await sql.query(
        `
        SELECT
            count(*) as count
        FROM
            dbo.[PECTH_EVALUATION_SCORE_HEADER]
        WHERE 
          SUPPLIER = '${supplier}' AND FORMAT(CAST('${evaluate_date}' as date) ,'yyyy-MM') = FORMAT(EVALUATE_DATE ,'yyyy-MM')
        `
      );
      let month = checked_month.recordset[0].count;
      if (month === 0) {
        // insert statement
        const EVALUATE_ID = `evaluation_${String(id).padStart(4, "0")}`;
        // Prepare headers insertion query
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
        request.input("FLAG_STATUS", String(flag_status).toUpperCase());
        await request.query(
          `
        INSERT INTO dbo.[PECTH_EVALUATION_SCORE_HEADER]
        ([EVALUATE_ID], [SUPPLIER], [DEPARTMENT], [EVALUATE_DATE], [EVALUATE_TOTAL_SCORE], [EVALUATE_FULL_SCORE], [EVALUATE_PERCENT], [EVALUATE_GRADE], [EVALUATE_COMMENT], [SUBMIT_FORM_DATE], [FLAG_STATUS])
        VALUES (@EVALUATE_ID, @SUPPLIER, @DEPARTMENT, @EVALUATE_DATE, @EVALUATE_TOTAL_SCORE, @EVALUATE_FULL_SCORE, @EVALUATE_PERCENT, @EVALUATE_GRADE, @EVALUATE_COMMENT, GETDATE(), @FLAG_STATUS)
        `
        );
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
        res.status(200)
      }
      else {
        res.status(500).send('hello duplicated')
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//display Evaluation is Draft
evaluate_form.get("/evaluate/draft", authenticateToken, async (req, res) => {
  try {
    const sql = await sql_serverConn();
    const request = sql.request();
    const result = await request.query(
      `
        SELECT
            upper(a.[EVALUATE_ID]) as EVALUATE_ID, a.DEPARTMENT,
            a.[SUPPLIER],
            a.[EVALUATE_DATE],
            CONCAT(
                COUNT(CASE WHEN b.EVALUATE_TOPIC_SCORE != 0 THEN 1 END), 
                '/', 
                COUNT(*)
            ) AS 'EVALUATED_AMOUNT',
            a.[FLAG_STATUS]
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER] a
            JOIN [dbo].[PECTH_EVALUATION_SCORE_DETAIL] b
            ON a.EVALUATE_ID = b.EVALUATE_ID
        GROUP BY a.[EVALUATE_ID], 
                a.[SUPPLIER], 
                a.[EVALUATE_DATE], 
                a.[FLAG_STATUS],
                a.DEPARTMENT
        HAVING LOWER(a.FLAG_STATUS) = 'draft'
        ORDER BY a.[EVALUATE_ID] asc
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
//display Evaluation is Waiting
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
            ) AS 'EVALUATED_AMOUNT',
            a.DEPARTMENT,
            a.[FLAG_STATUS],
            a.EVALUATE_GRADE
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER] a
            JOIN [dbo].[PECTH_EVALUATION_SCORE_DETAIL] b
            ON a.EVALUATE_ID = b.EVALUATE_ID
        GROUP BY a.[EVALUATE_ID], 
                a.[SUPPLIER], 
                a.[EVALUATE_DATE], 
                a.[FLAG_STATUS],
                a.DEPARTMENT,
                a.EVALUATE_GRADE
        HAVING LOWER(a.FLAG_STATUS) in ('waiting', 'confirm')
        ORDER BY a.[FLAG_STATUS] desc
      `
    );
    res.status(200).send(result.recordset);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
// EVALUATE UPDATE
evaluate_form.put(
  "/evaluate/form/update/:evaluate_id",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.evaluate_id;
      const sql = await sql_serverConn();
      const { supplier, comments, updateScore, flag_status, full_score } =
        req.body;

      // Calculate total score and evaluation percent
      const totalScore = updateScore.reduce(
        (sum, form) => sum + form.EVALUATE_TOPIC_SCORE,
        0
      );
      const evaluatePercent = (totalScore / full_score) * 100;

      // Determine evaluation grade
      const evaluateGrade =
        evaluatePercent <= 69
          ? "D"
          : evaluatePercent <= 79
          ? "C"
          : evaluatePercent <= 89
          ? "B"
          : "A";

      // Update evaluation header
      const evaluateHeaderRequest = sql.request();
      evaluateHeaderRequest.input("EVALUATE_ID", String(id).toLowerCase());
      evaluateHeaderRequest.input("EVALUATE_TOTAL_SCORE", totalScore);
      evaluateHeaderRequest.input("EVALUATE_FULL_SCORE", full_score);
      evaluateHeaderRequest.input("EVALUATE_PERCENT", evaluatePercent);
      evaluateHeaderRequest.input("EVALUATE_GRADE", evaluateGrade);
      evaluateHeaderRequest.input("EVALUATE_COMMENT", comments);
      evaluateHeaderRequest.input(
        "FLAG_STATUS",
        String(flag_status).toUpperCase()
      );

      await evaluateHeaderRequest.query(`
        UPDATE dbo.[PECTH_EVALUATION_SCORE_HEADER]
        SET 
          EVALUATE_TOTAL_SCORE = @EVALUATE_TOTAL_SCORE,
          EVALUATE_FULL_SCORE = @EVALUATE_FULL_SCORE,
          EVALUATE_PERCENT = @EVALUATE_PERCENT,
          EVALUATE_GRADE = @EVALUATE_GRADE,
          EVALUATE_COMMENT=@EVALUATE_COMMENT,
          SUBMIT_FORM_DATE=GETDATE(),
          FLAG_STATUS = @FLAG_STATUS
        WHERE LOWER([EVALUATE_ID]) = @EVALUATE_ID
      `);
      // Update each evaluation detail
      for (const score of updateScore) {
        const evaluateDetailRequest = sql.request();
        evaluateDetailRequest.input("EVALUATE_ID", String(id).toLowerCase());
        evaluateDetailRequest.input("SUPPLIER", String(supplier).toLowerCase());
        evaluateDetailRequest.input("HEADER_INDEX", score.HEADER_INDEX);
        evaluateDetailRequest.input("TOPIC_KEY_ID", score.TOPIC_KEY_ID);
        evaluateDetailRequest.input(
          "EVALUATE_TOPIC_SCORE",
          score.EVALUATE_TOPIC_SCORE
        );
        await evaluateDetailRequest.query(`
          UPDATE dbo.[PECTH_EVALUATION_SCORE_DETAIL]
          SET
            [EVALUATE_TOPIC_SCORE] = @EVALUATE_TOPIC_SCORE
          WHERE
          EVALUATE_ID = @EVALUATE_ID
          AND LOWER([SUPPLIER]) = @SUPPLIER
          AND HEADER_INDEX = @HEADER_INDEX
          AND TOPIC_KEY_ID = @TOPIC_KEY_ID
      `);
      }
      res.status(200).send("Data updated successfully");
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//EVALUATE APPROVE
evaluate_form.put(
  "/evaluate/form/update/:approve_id",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.approve_id;
      const sql = await sql_serverConn();
      const { supplier, comments, updateScore, flag_status, full_score } =
        req.body;

      // Calculate total score and evaluation percent
      const totalScore = updateScore.reduce(
        (sum, form) => sum + form.EVALUATE_TOPIC_SCORE,
        0
      );
      const evaluatePercent = (totalScore / full_score) * 100;

      // Determine evaluation grade
      const evaluateGrade =
        evaluatePercent <= 69
          ? "D"
          : evaluatePercent <= 79
          ? "C"
          : evaluatePercent <= 89
          ? "B"
          : "A";

      // Update evaluation header
      const evaluateHeaderRequest = sql.request();
      evaluateHeaderRequest.input("EVALUATE_ID", String(id).toLowerCase());
      evaluateHeaderRequest.input("EVALUATE_TOTAL_SCORE", totalScore);
      evaluateHeaderRequest.input("EVALUATE_FULL_SCORE", full_score);
      evaluateHeaderRequest.input("EVALUATE_PERCENT", evaluatePercent);
      evaluateHeaderRequest.input("EVALUATE_GRADE", evaluateGrade);
      evaluateHeaderRequest.input("EVALUATE_COMMENT", comments);
      evaluateHeaderRequest.input(
        "FLAG_STATUS",
        String(flag_status).toUpperCase()
      );

      await evaluateHeaderRequest.query(`
        UPDATE dbo.[PECTH_EVALUATION_SCORE_HEADER]
        SET 
          EVALUATE_TOTAL_SCORE = @EVALUATE_TOTAL_SCORE,
          EVALUATE_FULL_SCORE = @EVALUATE_FULL_SCORE,
          EVALUATE_PERCENT = @EVALUATE_PERCENT,
          EVALUATE_GRADE = @EVALUATE_GRADE,
          EVALUATE_COMMENT=@EVALUATE_COMMENT,
          SUBMIT_FORM_DATE=GETDATE(),
          FLAG_STATUS = @FLAG_STATUS
        WHERE LOWER([EVALUATE_ID]) = @EVALUATE_ID
      `);
      // Update each evaluation detail
      for (const score of updateScore) {
        const evaluateDetailRequest = sql.request();
        evaluateDetailRequest.input("EVALUATE_ID", String(id).toLowerCase());
        evaluateDetailRequest.input("SUPPLIER", String(supplier).toLowerCase());
        evaluateDetailRequest.input("HEADER_INDEX", score.HEADER_INDEX);
        evaluateDetailRequest.input("TOPIC_KEY_ID", score.TOPIC_KEY_ID);
        evaluateDetailRequest.input(
          "EVALUATE_TOPIC_SCORE",
          score.EVALUATE_TOPIC_SCORE
        );
        await evaluateDetailRequest.query(`
          UPDATE dbo.[PECTH_EVALUATION_SCORE_DETAIL]
          SET
            [EVALUATE_TOPIC_SCORE] = @EVALUATE_TOPIC_SCORE
          WHERE
          EVALUATE_ID = @EVALUATE_ID
          AND LOWER([SUPPLIER]) = @SUPPLIER
          AND HEADER_INDEX = @HEADER_INDEX
          AND TOPIC_KEY_ID = @TOPIC_KEY_ID
      `);
      }
      res.status(200).send("Data updated successfully");
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
        SELECT distinct a.HEADER_INDEX, a.TOPIC_KEY_ID, c.TOPIC_NAME_TH, c.TOPIC_HEADER_NAME_TH, c.TOPIC_HEADER_NAME_ENG, c.TOPIC_NAME_EN, a.EVALUATE_TOPIC_SCORE, b.FLAG_STATUS, max(b.EVALUATE_DATE) as EVALUATE_DATE, b.EVALUATE_COMMENT
        FROM [dbo].[PECTH_EVALUATION_SCORE_DETAIL] a
            LEFT JOIN dbo.[PECTH_EVALUATION_SCORE_HEADER] b
            ON a.EVALUATE_ID = b.EVALUATE_ID
            LEFT JOIN dbo.[PECTH_EVALUATION_MASTER] c
            ON a.TOPIC_KEY_ID = c.TOPIC_KEY_ID
        GROUP BY a.HEADER_INDEX, a.TOPIC_KEY_ID, a.EVALUATE_ID, a.SUPPLIER, b.FLAG_STATUS, b.EVALUATE_DATE, c.TOPIC_NAME_TH, c.TOPIC_NAME_EN, c.TOPIC_HEADER_NAME_TH, c.TOPIC_HEADER_NAME_ENG, a.EVALUATE_TOPIC_SCORE, b.FLAG_STATUS, b.EVALUATE_COMMENT
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
evaluate_form.post(
  "/evaluate/generate_pdf",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();
      const { supplier, evaluate_id, flag_status } = req.body;
      request.input("supplier", String(supplier).toLowerCase());
      request.input("evaluate_id", String(evaluate_id).toLowerCase());
      request.input("status", flag_status);
      const result = await request.query(
        `
        SELECT
          DISTINCT
          a.TOPIC_NAME_TH,
          a.TOPIC_NAME_EN,
          b.EVALUATE_TOPIC_SCORE,
          c.EVALUATE_PERCENT,
          a.TOPIC_HEADER_NAME_TH,
          a.TOPIC_HEADER_NAME_ENG,
          a.HEADER_INDEX, a.TOPIC_LINE,
          c.EVALUATE_FULL_SCORE,
          c.EVALUATE_COMMENT,
          c.EVALUATE_GRADE
        FROM [dbo].PECTH_EVALUATION_MASTER a
            JOIN dbo.PECTH_EVALUATION_SCORE_DETAIL b
            ON a.TOPIC_KEY_ID = b.TOPIC_KEY_ID
            JOIN dbo.PECTH_EVALUATION_SCORE_HEADER c
            ON b.EVALUATE_ID = c.EVALUATE_ID
        GROUP BY a.HEADER_INDEX, a.TOPIC_LINE, c.EVALUATE_ID, a.TOPIC_NAME_TH,a.TOPIC_NAME_EN,b.EVALUATE_TOPIC_SCORE,a.TOPIC_HEADER_NAME_TH,a.TOPIC_HEADER_NAME_ENG, c.EVALUATE_PERCENT, c.FLAG_STATUS, c.SUPPLIER, c.EVALUATE_FULL_SCORE, c.EVALUATE_COMMENT, c.EVALUATE_GRADE
        HAVING LOWER(c.FLAG_STATUS)=@status and LOWER(c.SUPPLIER)=@supplier AND LOWER(c.EVALUATE_ID)=@evaluate_id
        ORDER BY a.HEADER_INDEX, a.TOPIC_LINE
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
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
        ORDER BY EVALUATE_ID asc
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// filter Summary Score
evaluate_form.post(
  "/evaluate/summary_score/filter",
  authenticateToken,
  async (req, res) => {
    try {
      const sql = await sql_serverConn();
      const request = sql.request();
      const { summary_date } = req.body;
      request.input("eva_date", summary_date);
      const result = await request.query(
        `
        SELECT
            UPPER(EVALUATE_ID) as EVALUATE_ID,
            SUPPLIER,
            ROUND(EVALUATE_PERCENT, 2) as EVALUATE_PERCENT,
            EVALUATE_GRADE,
            EVALUATE_COMMENT
        FROM [dbo].[PECTH_EVALUATION_SCORE_HEADER]
        WHERE [EVALUATE_DATE] BETWEEN CAST(CONCAT(@eva_date,'-01') AS DATE) AND EOMONTH(CAST(CONCAT(@eva_date,'-01') AS DATE))
        AND LOWER(FLAG_STATUS) = 'confirm'
        GROUP BY EVALUATE_ID, SUPPLIER, EVALUATE_PERCENT, EVALUATE_GRADE, FLAG_STATUS, EVALUATE_COMMENT
        ORDER BY EVALUATE_ID asc
        `
      );
      res.status(200).send(result.recordset);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = evaluate_form;
