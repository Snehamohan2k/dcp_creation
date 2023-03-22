import React from "react";
import {  Progress, Space, Typography } from "antd";
import { FileOutlined } from '@ant-design/icons';
  const VerifyProgress=(props)=>{
  return (
    <div>
      <div>
        {Object.keys(props.uploadProgress).map((fileName) => (
          <div key={fileName}>
            <Space
              direction="vertical"
              style={{ backgroundColor: "rgba", width: 500, padding: 8 }}
            >
              <Space>
                <FileOutlined />
                <span>{fileName}</span>
                <Typography.Text type="secondary">
                  {props.uploadProgress[fileName] &&
                  props.uploadProgress[fileName].estimatedTime !== undefined
                    ? ` is being verified in ${props.uploadProgress[fileName].estimatedTime} seconds`
                    : ""}
                </Typography.Text>
              </Space>
              <Progress
                percent={Math.ceil(props.uploadProgress[fileName].progress)}
              />
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifyProgress;
