import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import { RocketOutlined, UploadOutlined } from "@ant-design/icons";
import useQueryParams from "renderer/hooks/useQueryParams";
import { useMutation, gql, useQuery } from "@apollo/client";
import FirmwareReleasesPicker from "./components/FirmwareReleasesPicker";
import FirmwareUploadArea from "./components/FirmwareUploadArea";

const FirmwareStep: React.FC<{ onNext?: () => void }> = () => {
  const { parseParam, updateParams } = useQueryParams(["version", "target"]);
  const [activeTab, setActiveTab] = useState<string>("releases");

  const version = parseParam("version");
  const target = parseParam("target");

  useEffect(() => {
    if (target === "local" && activeTab !== "file") {
      setActiveTab("file");
    }
  }, [setActiveTab, target, activeTab]);

  return (
    <Tabs
      activeKey={activeTab}
      destroyInactiveTabPane
      onChange={(key) => {
        updateParams({
          version: undefined,
          target: undefined,
        });
        setActiveTab(key);
      }}
    >
      <Tabs.TabPane
        tab={
          <span>
            <RocketOutlined />
            Releases
          </span>
        }
        key="releases"
      >
        <FirmwareReleasesPicker
          version={version}
          target={target}
          onChanged={updateParams}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <UploadOutlined />
            File
          </span>
        }
        key="file"
      >
        <FirmwareUploader
          selectedFile={target === "local" ? version : undefined}
          onFileUploaded={(fileId) => {
            if (fileId) {
              updateParams({
                version: fileId,
                target: "local",
              });
            } else {
              updateParams({
                target: undefined,
                version: undefined,
              });
            }
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

type FirmwareUploaderProps = {
  onFileUploaded: (fileId?: string) => void;
  selectedFile?: string;
};

const FirmwareUploader: React.FC<FirmwareUploaderProps> = ({
  onFileUploaded,
  selectedFile,
}) => {
  const [registerFirmware, { loading: uploading }] = useMutation(
    gql(/* GraphQL */ `
      mutation RegisterLocalFirmwareWithName($name: String!, $data: String!) {
        registerLocalFirmware(firmwareBase64Data: $data, fileName: $name) {
          id
        }
      }
    `)
  );
  const { data, loading } = useQuery(
    gql(/* GraphQL */ `
      query LocalFirmwareInfo($fileId: ID!) {
        localFirmware(byId: $fileId) {
          id
          name
        }
      }
    `),
    {
      variables: {
        fileId: selectedFile ?? "",
      },
      // TODO: use uuid for file ids
      fetchPolicy: "network-only",
      skip: !selectedFile,
    }
  );

  const firmwareInfo = data?.localFirmware;

  useEffect(() => {
    if (selectedFile && !loading && !firmwareInfo) {
      // Deselect the file
      onFileUploaded(undefined);
    }
  }, [selectedFile, loading, onFileUploaded, firmwareInfo]);

  return (
    <FirmwareUploadArea
      loading={loading || uploading}
      uploadedFile={firmwareInfo ?? undefined}
      onFileSelected={(file) => {
        if (file) {
          void registerFirmware({
            variables: {
              name: file.name,
              data: file.base64Data,
            },
          })
            .then((result) => {
              if (result.data) {
                onFileUploaded(result.data.registerLocalFirmware.id);
              }
            })
            .catch((e) => {
              void message.error((e as Error).message);
            });
        } else {
          onFileUploaded();
        }
      }}
    />
  );
};

export default FirmwareStep;
