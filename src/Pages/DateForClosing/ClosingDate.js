import React from "react";
import { Form, DatePicker, Button, message, Modal } from "antd";
import Header from "../../Components/Common/Header";
import RemainingProduction from "../Production/RemainingProduction";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {
  UpdateOpeningStockOfItem,
  GetLastClosingDates,
} from "../../Services/appServices/ProductionService";
import useToken from "../../Helpers/useToken";
const ClosingDate = () => {
  const { token } = useToken();
  const [isbutdis, setisbutdis] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resDate, setResDate] = useState();
  let correct = resDate?.split("T")[0];
  console.log(correct, "resDate");
  let newCorrect = selectedDate?.format("YYYY-MM-DD");
  console.log(newCorrect, "newDate");

  useEffect(() => {
    GetLastClosingDates((res) => {
      setResDate(res.GetLastClosingDate[0].OpeningDate);
    });
    if (correct >= newCorrect) {
      setisbutdis(true);
      alert("This date is used already for the Closing");
    } else {
      setisbutdis(false);
    }
  }, [newCorrect, correct]);

  const handleSave = () => {
    if (!selectedDate) {
      message.error("Please select a date.");
      return;
    }
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    let data = {
      currentDate: selectedDate?.format("YYYY-MM-DD"),
      userId: token.id,
    };
    setisbutdis(true);
    UpdateOpeningStockOfItem(data, (res) => {
      console.log(res, "Response Data");
      console.log(data, "Hello guys");
      if (res.SuccessMsg) {
        message.success("Closing has been Successful!!");
        setisbutdis(true);
      } else {
        message.error("Error!");
        setisbutdis(false);
      }
    });
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Form layout="vertical">
      <Top>
        <Header title="Closing Date For the Stock"></Header>
      </Top>

      <Closing>
        <Form.Item>
          <ClosingHead> Enter Closing date</ClosingHead>

          <b style={{ fontSize: "20px" }}>Date:</b>

          <DatePicker
            name="Date"
            label="Date"
            id="Date"
            rules={[
              {
                required: true,
                message: "Date is required!",
              },
            ]}
            style={{ width: "40%", margin: "0 5px 0 5px", textAlign: "center" }}
            onChange={(date) => setSelectedDate(date)}
          />
          <Button type="primary" onClick={handleSave} disabled={isbutdis}>
            Save
          </Button>
        </Form.Item>
      </Closing>
      <Modal
        title="Confirm Closing Date"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { background: "rgb(21 132 227 / 85%)", color: "white" },
        }}
        cancelButtonProps={{ style: { background: "#f5222d", color: "white" } }}
      >
        <Mod>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>
            Do you want to close the stock for the selected date?<br></br>
            This will update the Opening Stock for tomorrow
          </p>
        </Mod>
      </Modal>

      <RemainingProduction />
    </Form>
  );
};
export default ClosingDate;
const Closing = styled.div`
  background-color: #fefefe;
  padding: 10px;
  box-shadow: 1px 2px 2px #b0bccea6;
  border-radius: 8px;
  overflow: hidden;
  min-height: 40px;
  justify-content: center;
  max-width: 100%;
  margin-bottom: 8px;
  margin-left: 0;
  box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -webkit-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -moz-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
`;

const Top = styled.div`
  background-color: #fefefe;
  padding: 10px;
  box-shadow: 1px 2px 2px #b0bccea6;
  border-radius: 8px;
  overflow: hidden;
  min-height: 40px;
  justify-content: center;
  text-align: center;
  max-width: 100%;
  margin-bottom: 8px;
  margin-left: 0;
  box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -webkit-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -moz-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
`;
const ClosingHead = styled.div`
  overflow: hidden;
  font-weight: bold;
  font-size: 30px;
  min-height: 40px;
  justify-content: center;
  ${"" /* text-align: center; */}
  max-width: 100%;
  margin-bottom: 8px;
  margin-left: 0;
`;

const Mod = styled.div`
  background-color: #fefefe;
  padding: 10px;
  box-shadow: 1px 2px 2px #b0bccea6;
  border-radius: 8px;
  overflow: hidden;
  min-height: 40px;
  justify-content: center;
  text-align: center;
  max-width: 100%;
  box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -webkit-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -moz-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
`;
