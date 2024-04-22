CREATE VIEW [dbo].[vwsummary91]
AS
SELECT eva91_deptname, eva91_sender_name, report_name, ISNULL(sc11, 0) + ISNULL(sc21, 0) + ISNULL(sc31, 0) + ISNULL(sc41, 0) + ISNULL(sc51, 0) + ISNULL(sc61, 0) + ISNULL(sqs11, 0) + ISNULL(sqs21, 0) + ISNULL(sqs31, 0) + ISNULL(sqs321, 0) + ISNULL(sqs331, 0) + ISNULL(sqs411, 0) 
             + ISNULL(sqs421, 0) + ISNULL(sqs431, 0) AS score1, ISNULL(sc12, 0) + ISNULL(sc22, 0) + ISNULL(sc32, 0) + ISNULL(sc42, 0) + ISNULL(sc52, 0) + ISNULL(sc62, 0) + ISNULL(sqs12, 0) + ISNULL(sqs22, 0) + ISNULL(sqs32, 0) + ISNULL(sqs322, 0) + ISNULL(sqs332, 0) + ISNULL(sqs412, 0) 
             + ISNULL(sqs422, 0) + ISNULL(sqs432, 0) AS score2, ISNULL(sc13, 0) + ISNULL(sc23, 0) + ISNULL(sc33, 0) + ISNULL(sc43, 0) + ISNULL(sc53, 0) + ISNULL(sc63, 0) + ISNULL(sqs13, 0) + ISNULL(sqs23, 0) + ISNULL(sqs33, 0) + ISNULL(sqs323, 0) + ISNULL(sqs333, 0) + ISNULL(sqs413, 0) 
             + ISNULL(sqs423, 0) + ISNULL(sqs433, 0) AS score3, ISNULL(sc14, 0) + ISNULL(sc24, 0) + ISNULL(sc34, 0) + ISNULL(sc44, 0) + ISNULL(sc54, 0) + ISNULL(sc64, 0) + ISNULL(sqs14, 0) + ISNULL(sqs24, 0) + ISNULL(sqs34, 0) + ISNULL(sqs324, 0) + ISNULL(sqs334, 0) + ISNULL(sqs414, 0) 
             + ISNULL(sqs424, 0) + ISNULL(sqs434, 0) AS score4, ISNULL(sc15, 0) + ISNULL(sc25, 0) + ISNULL(sc35, 0) + ISNULL(sc45, 0) + ISNULL(sc55, 0) + ISNULL(sc65, 0) + ISNULL(sqs15, 0) + ISNULL(sqs25, 0) + ISNULL(sqs35, 0) + ISNULL(sqs325, 0) + ISNULL(sqs335, 0) + ISNULL(sqs415, 0) 
             + ISNULL(sqs425, 0) + ISNULL(sqs435, 0) AS score5, ((((ISNULL(sc11, 0) + ISNULL(sc21, 0) + ISNULL(sc31, 0) + ISNULL(sc41, 0) + ISNULL(sc51, 0) + ISNULL(sc61, 0) + ISNULL(sqs11, 0) + ISNULL(sqs21, 0) + ISNULL(sqs31, 0) + ISNULL(sqs321, 0) + ISNULL(sqs331, 0) + ISNULL(sqs411, 0) 
             + ISNULL(sqs421, 0) + ISNULL(sqs431, 0)) + (ISNULL(sc12, 0) + ISNULL(sc22, 0) + ISNULL(sc32, 0) + ISNULL(sc42, 0) + ISNULL(sc52, 0) + ISNULL(sc62, 0) + ISNULL(sqs12, 0) + ISNULL(sqs22, 0) + ISNULL(sqs32, 0) + ISNULL(sqs322, 0) + ISNULL(sqs332, 0) + ISNULL(sqs412, 0) 
             + ISNULL(sqs422, 0) + ISNULL(sqs432, 0))) + (ISNULL(sc13, 0) + ISNULL(sc23, 0) + ISNULL(sc33, 0) + ISNULL(sc43, 0) + ISNULL(sc53, 0) + ISNULL(sc63, 0) + ISNULL(sqs13, 0) + ISNULL(sqs23, 0) + ISNULL(sqs33, 0) + ISNULL(sqs323, 0) + ISNULL(sqs333, 0) + ISNULL(sqs413, 0) 
             + ISNULL(sqs423, 0) + ISNULL(sqs433, 0))) + (ISNULL(sc14, 0) + ISNULL(sc24, 0) + ISNULL(sc34, 0) + ISNULL(sc44, 0) + ISNULL(sc54, 0) + ISNULL(sc64, 0) + ISNULL(sqs14, 0) + ISNULL(sqs24, 0) + ISNULL(sqs34, 0) + ISNULL(sqs324, 0) + ISNULL(sqs334, 0) + ISNULL(sqs414, 0) 
             + ISNULL(sqs424, 0) + ISNULL(sqs434, 0))) + (ISNULL(sc15, 0) + ISNULL(sc25, 0) + ISNULL(sc35, 0) + ISNULL(sc45, 0) + ISNULL(sc55, 0) + ISNULL(sc65, 0) + ISNULL(sqs15, 0) + ISNULL(sqs25, 0) + ISNULL(sqs35, 0) + ISNULL(sqs325, 0) + ISNULL(sqs335, 0) + ISNULL(sqs415, 0) 
             + ISNULL(sqs425, 0) + ISNULL(sqs435, 0)) * 100 / 70 AS percenscore, CASE WHEN (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 0) + isnull(sqs321, 0) + isnull(sqs331, 0) + isnull(sqs411, 0) 
             + isnull(sqs421, 0) + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) + isnull(sqs412, 0) + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 
             0) + isnull(sc23, 0) + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 0)) + (isnull(sc14, 0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) 
             + isnull(sc54, 0) + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) + isnull(sc45, 0) + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) 
             + isnull(sqs25, 0) + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 >= 90 AND (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 
             0) + isnull(sqs321, 0) + isnull(sqs331, 0) + isnull(sqs411, 0) + isnull(sqs421, 0) + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) 
             + isnull(sqs412, 0) + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 0) + isnull(sc23, 0) + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 
             0)) + (isnull(sc14, 0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) + isnull(sc54, 0) + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) 
             + isnull(sc45, 0) + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) + isnull(sqs25, 0) + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 <= 100 THEN 'A' WHEN (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) 
             + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 0) + isnull(sqs321, 0) + isnull(sqs331, 0) + isnull(sqs411, 0) + isnull(sqs421, 0) + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) 
             + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) + isnull(sqs412, 0) + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 0) + isnull(sc23, 0) + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) 
             + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 0)) + (isnull(sc14, 0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) + isnull(sc54, 0) + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 
             0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) + isnull(sc45, 0) + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) + isnull(sqs25, 0) + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 >= 80 AND 
             (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 0) + isnull(sqs321, 0) + isnull(sqs331, 0) + isnull(sqs411, 0) + isnull(sqs421, 0) + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) 
             + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) + isnull(sqs412, 0) + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 0) + isnull(sc23, 0) + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) 
             + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 0)) + (isnull(sc14, 0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) + isnull(sc54, 0) + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) 
             + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) + isnull(sc45, 0) + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) + isnull(sqs25, 0) + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 
             0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 <= 89 THEN 'B' WHEN (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 0) + isnull(sqs321, 0) + isnull(sqs331, 0) + isnull(sqs411, 0) + isnull(sqs421, 0) 
             + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) + isnull(sqs412, 0) + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 0) + isnull(sc23, 0) 
             + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 0)) + (isnull(sc14, 0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) + isnull(sc54, 0) 
             + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) + isnull(sc45, 0) + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) + isnull(sqs25, 0) 
             + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 >= 70 AND (isnull(sc11, 0) + isnull(sc21, 0) + isnull(sc31, 0) + isnull(sc41, 0) + isnull(sc51, 0) + isnull(sc61, 0) + isnull(sqs11, 0) + isnull(sqs21, 0) + isnull(sqs31, 0) + isnull(sqs321, 
             0) + isnull(sqs331, 0) + isnull(sqs411, 0) + isnull(sqs421, 0) + isnull(sqs431, 0)) + (isnull(sc12, 0) + isnull(sc22, 0) + isnull(sc32, 0) + isnull(sc42, 0) + isnull(sc52, 0) + isnull(sc62, 0) + isnull(sqs12, 0) + isnull(sqs22, 0) + isnull(sqs32, 0) + isnull(sqs322, 0) + isnull(sqs332, 0) + isnull(sqs412, 0) 
             + isnull(sqs422, 0) + isnull(sqs432, 0)) + (isnull(sc13, 0) + isnull(sc23, 0) + isnull(sc33, 0) + isnull(sc43, 0) + isnull(sc53, 0) + isnull(sc63, 0) + isnull(sqs13, 0) + isnull(sqs23, 0) + isnull(sqs33, 0) + isnull(sqs323, 0) + isnull(sqs333, 0) + isnull(sqs413, 0) + isnull(sqs423, 0) + isnull(sqs433, 0)) + (isnull(sc14, 
             0) + isnull(sc24, 0) + isnull(sc34, 0) + isnull(sc44, 0) + isnull(sc54, 0) + isnull(sc64, 0) + isnull(sqs14, 0) + isnull(sqs24, 0) + isnull(sqs34, 0) + isnull(sqs324, 0) + isnull(sqs334, 0) + isnull(sqs414, 0) + isnull(sqs424, 0) + isnull(sqs434, 0)) + (isnull(sc15, 0) + isnull(sc25, 0) + isnull(sc35, 0) + isnull(sc45, 0) 
             + isnull(sc55, 0) + isnull(sc65, 0) + isnull(sqs15, 0) + isnull(sqs25, 0) + isnull(sqs35, 0) + isnull(sqs325, 0) + isnull(sqs335, 0) + isnull(sqs415, 0) + isnull(sqs425, 0) + isnull(sqs435, 0)) * 100 / 70 <= 79 THEN 'C' ELSE 'D' END AS grade, evacomment, CONVERT(nvarchar(10), evacreatedate, 120) 
             AS evacreatedate
FROM   dbo.tb_eva91detail AS tb_eva91detail_1