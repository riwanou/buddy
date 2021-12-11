import { Card } from "antd";
import React from "react";
import FirmwareReleaseSummary from "renderer/pages/flash/v2/components/FirmwareReleaseSummary";
import { Centered } from "renderer/pages/flash/v2/shared";

export default {
  title: "Flashing/Overview/FirmwareReleaseSummary",
  component: FirmwareReleaseSummary,
};

export const example: React.FC = () => (
  <FirmwareReleaseSummary
    releaseName="EdgeTX 'lol' v2.5.0"
    targetName="FlySky Nirvana"
  />
);

export const inCard: React.FC = () => (
  <Card style={{ width: 500 }}>
    <Centered>
      <FirmwareReleaseSummary
        releaseName="EdgeTX 'Something' v2.5.0"
        targetName="FlySky Nirvana"
      />
    </Centered>
  </Card>
);
