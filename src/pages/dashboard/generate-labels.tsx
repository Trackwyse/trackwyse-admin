/*
 * Created on Fri Feb 03 2023
 * Created by JS00001
 *
 * Copyright (c) 2023 Trackwyse
 */

import QRCode from "react-qr-code";
import classNames from "classnames";
import html2canvas from "html2canvas";
import { useState, useRef } from "react";

import api from "@/api";
import withAuth from "@/hoc/withAuth";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";

const DashboardGenerateLabelsPage: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<string[]>([]);

  const createLabelSheetMutation = useMutation({
    mutationFn: async () => {
      return api.createLabelSheet();
    },
  });

  const handleGenerateLabelSheet = async () => {
    createLabelSheetMutation.mutate(undefined, {
      onSuccess: ({ data }) => {
        const labelData = data.labels.map((label) => `trw://${label.uniqueID}`);
        setLabels(labelData);
      },
      onError: (error) => {},
    });
  };

  const onDownloadLabelSheet = () => {
    const element = divRef.current;

    if (!element) return;

    html2canvas(element, {
      onclone: (document) => {
        // set the display style of the cloned element to 'block'
        // so that it is visible in the canvas
        const element = document.getElementById("offscreenLabels");

        if (!element) return;

        element!.style.display = "block";
      },
      backgroundColor: null,
    }).then((canvas) => {
      let a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "label-sheet.png";
      a.click();
    });
  };

  return (
    <Layout>
      <Layout.Header>Generate Labels</Layout.Header>
      <Layout.Content>
        <div className="flex items-center gap-x-5">
          <Button onClick={handleGenerateLabelSheet} loading={createLabelSheetMutation.isLoading}>
            Generate Label Sheet
          </Button>
          <Button onClick={onDownloadLabelSheet}>Download Label Sheet</Button>
        </div>
        {/* 
        {labels.length > 0 && (
          <div className="mt-10 flex justify-center ">
            <div className="rounded-2xl border border-gray-200 px-6 pb-6">
              <div id="labelSheet" className="h-[504px] w-[886px] ">
                <div className="grid h-full grid-cols-3 grid-rows-2 ">
                  {labels.map((label, index) => (
                    <div
                      className={classNames(
                        "flex",
                        index % 3 === 0
                          ? "justify-start"
                          : index % 3 === 1
                          ? "justify-center"
                          : "justify-end",
                        index < 3 ? "items-start" : "items-end"
                      )}
                    >
                      <QRCode size={128} value={label.toString()} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )} */}

        {labels.length > 0 && (
          <div id="offscreenLabels" ref={divRef} className="hidden h-[504px] w-[886px]">
            <div className="grid h-full grid-cols-3 grid-rows-2 ">
              {labels.map((label, index) => (
                <div
                  className={classNames(
                    "flex",
                    index % 3 === 0
                      ? "justify-start"
                      : index % 3 === 1
                      ? "justify-center"
                      : "justify-end",
                    index < 3 ? "items-start" : "items-end"
                  )}
                >
                  <QRCode size={128} value={label.toString()} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(DashboardGenerateLabelsPage);
