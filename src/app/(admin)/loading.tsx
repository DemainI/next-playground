"use client";

import { Card, Row, Col, Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* 欢迎区域骨架 */}
      <Skeleton
        active
        paragraph={{ rows: 2 }}
        className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6"
      />

      {/* 统计卡片骨架 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
      </Row>

      {/* 提示信息卡片骨架 */}
      <Card
        title={<Skeleton.Input active size="small" style={{ width: 100 }} />}
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    </div>
  );
}
