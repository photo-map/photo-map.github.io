import React from "react";
import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface HelpTipProps {
  children?: React.ReactNode;
}

export default function HelpTip(props: HelpTipProps) {
  return (
    <Popover content={props.children} title={null}>
      <QuestionCircleOutlined />
    </Popover>
  );
}