import React from "react";
import {  Progress, Space, Typography } from "antd";
import { FileOutlined } from '@ant-design/icons';

function VerifyProgress({ uploadProgress }) {
  return (
    <div>
      <div>
        {Object.keys(uploadProgress).map((fileName) => (
          <div key={fileName}>
            <Space
              direction="vertical"
              style={{ backgroundColor: "rgba", width: 500, padding: 8 }}
            >
              <Space>
                <FileOutlined />
                <span>{fileName}</span>
                <Typography.Text type="secondary">
                  {uploadProgress[fileName] &&
                  uploadProgress[fileName].estimatedTime !== undefined
                    ? ` is being verified in ${uploadProgress[fileName].estimatedTime} seconds`
                    : ""}
                </Typography.Text>
              </Space>
              <Progress
                percent={Math.ceil(uploadProgress[fileName].progress)}
              />
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifyProgress;
