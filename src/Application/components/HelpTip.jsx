import React from "react";
import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function HelpTip(props) {
  return (
    <Popover content={props.children} title={null}>
      <QuestionCircleOutlined />
    </Popover>
  );
}
