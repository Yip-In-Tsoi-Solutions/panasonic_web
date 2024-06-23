import { memo, useMemo } from "react";
import { Form, List, Radio } from "antd";

const Group_topic_approve = ({ topicGroup, setScoreApprove }) => {
  // Group topics by HEADER_INDEX
  const groupedTopics = topicGroup.reduce((groups, item) => {
    const index = item.HEADER_INDEX;
    if (!groups[index]) {
      groups[index] = [];
    }
    groups[index].push(item);
    return groups;
  }, {});

  // Function to generate score object
  const generateScoreObject = (record, scoring) => {
    const {
      HEADER_INDEX,
      TOPIC_HEADER_NAME_TH,
      TOPIC_HEADER_NAME_ENG,
      TOPIC_KEY_ID,
      TOPIC_LINE,
      TOPIC_NAME_TH,
      TOPIC_NAME_EN,
      CREATED_DATE,
      ACTIVE_DATE_FROM,
      ACTIVE_DATE_TO,
      TOPIC_NAME,
    } = record;

    return {
      TOPIC_NAME,
      TOPIC_NAME_TH,
      TOPIC_NAME_EN,
      HEADER_INDEX,
      TOPIC_KEY_ID,
      TOPIC_HEADER_NAME_TH,
      TOPIC_HEADER_NAME_ENG,
      TOPIC_LINE,
      CREATED_DATE,
      ACTIVE_DATE_FROM,
      ACTIVE_DATE_TO,
      EVALUATE_TOPIC_SCORE: scoring,
    };
  };

  // Initialize the score state with 0 for all topics
  useMemo(() => {
    const initialScores = topicGroup.map((item) =>
      generateScoreObject(item, item?.EVALUATE_TOPIC_SCORE)
    );
    setScoreApprove(initialScores);
  }, []);

  // Handle score change
  const handleScoreChange = (record, e) => {
    const scoring = e.target.value;
    const scoreObject = generateScoreObject(record, scoring);

    setScoreApprove((prevScore) => {
      const existingIndex = prevScore.findIndex(
        (item) => item.TOPIC_KEY_ID === record.TOPIC_KEY_ID
      );

      if (existingIndex === -1) {
        return [...prevScore, scoreObject];
      } else {
        const newScore = [...prevScore];
        newScore[existingIndex] = scoreObject;
        return newScore;
      }
    });
  };
  return Object.keys(groupedTopics).map((headerIndex) => (
    <div key={headerIndex}>
      <p className="text-[18px] font-bold">
        {groupedTopics[headerIndex][0].TOPIC_HEADER_NAME_TH}
      </p>
      <List
        dataSource={groupedTopics[headerIndex]}
        renderItem={(item) => (
          <List.Item key={item.TOPIC_KEY_ID}>
            <List.Item.Meta
              title={
                <h1 className="text-[14px] font-normal">
                  {item.TOPIC_NAME_TH} <br />({item.TOPIC_NAME_EN})
                </h1>
              }
            />
            <div>
              <Form.Item className="mt-5" name={`scoreUpdate_${item.TOPIC_KEY_ID}`}>
                <Radio.Group
                  onChange={(e) => handleScoreChange(item, e)}
                  defaultValue={item.EVALUATE_TOPIC_SCORE}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Radio key={value} className="text-[12px]" value={value}>
                      {value}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
          </List.Item>
        )}
      />
      <br />
    </div>
  ));
};

export default memo(Group_topic_approve);
