import React from "react";
import { highlightJson } from "../libs/json-highlight";
import { copyToClipboard } from "../libs/utils";

import "../styles/index.css";

interface IReactErrorReportingProps {
  onCopy?: () => void;
  eventKey: string;
  eventTarget: EventTarget;
  emptyComponent?: React.ReactNode;
  translateKeys?: {
    copyAll: string;
    requestDetails: string;
    collapse: string;
    expand: string;
  };
}

export const ReactErrorReporting: React.FC<IReactErrorReportingProps> = ({
  eventKey,
  eventTarget,
  onCopy,
  translateKeys = {
    copyAll: "copy all",
    requestDetails: "request details",
    collapse: "collapse",
    expand: "expand",
  },
  emptyComponent = <p className="text-gray-500">No error details available.</p>,
}) => {
  const [ErrorDetails, setErrorDetails] = React.useState<Record<
    string,
    unknown
  > | null>(null);

  React.useEffect(() => {
    const handler = async (e: Event) => {
      const customEvent = e as CustomEvent;
      setErrorDetails(customEvent.detail);
    };

    eventTarget.addEventListener(eventKey, handler);
    return () => {
      eventTarget.removeEventListener(eventKey, handler);
    };
  }, [eventKey, eventTarget]);

  return (
    <React.Fragment>
      {ErrorDetails ? (
        <div className="flex flex-col items-center justify-center w-full max-w-xl border border-gray-200 rounded-xl overflow-hidden">
          <div className="self-start p-2 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-5 h-5 fill-red-700"
              >
                <title>error</title>
                <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82ZM120,80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-xl capitalize">
                  {translateKeys.requestDetails}
                </p>

                {/* <small>{ErrorDetails}</small> */}
              </div>
            </div>

            <button
              type="button"
              className="group text-sm flex items-center gap-1 cursor-pointer text-[#929292] hover:text-black transition-colors duration-200 capitalize"
              onClick={async () => {
                await copyToClipboard(JSON.stringify(ErrorDetails, null, 2));
                onCopy?.();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-4 fill-[#929292] group-hover:fill-black transition-colors duration-200"
              >
                <title>Copy</title>
                <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
              </svg>
              {translateKeys.copyAll}
            </button>
          </div>

          <div className="flex flex-col w-full max-h-[600px] overflow-y-auto relative">
            {Object.entries(ErrorDetails).map(([key, value], index) => (
              <ListItem
                key={index.toString()}
                name={key}
                value={value}
                translateKeys={translateKeys}
              />
            ))}
          </div>
        </div>
      ) : (
        emptyComponent
      )}
    </React.Fragment>
  );
};

const ListItem = ({
  name,
  value,
  translateKeys = { collapse: "collapse", expand: "expand" },
}: {
  name: string;
  value: unknown;
  translateKeys: Partial<IReactErrorReportingProps["translateKeys"]>;
}) => {
  const [Expand, setExpand] = React.useState(false);
  return (
    <>
      {value &&
      (typeof value === "object" ||
        (typeof value === "string" &&
          /<!doctype html>|<html[\s\S]*?>[\s\S]*?<body[\s\S]*?>/i.test(
            value
          ))) ? (
        <div className="border-b border-gray-200 last:border-b-0">
          <button
            type="button"
            className={`flex items-center justify-between p-2 text-sm w-full cursor-pointer bg-[#f3f3f3] ${
              Expand ? "sticky top-0 z-10" : ""
            }`}
            onClick={() => setExpand(!Expand)}
          >
            <div className="flex items-center gap-2 min-w-sm">
              <pre>{name}</pre>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-4 fill-[#929292]"
              >
                <title>List</title>
                <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM68,168a12,12,0,1,1,12-12A12,12,0,0,1,68,168Zm0-56a12,12,0,1,1,12-12A12,12,0,0,1,68,112Zm60,56a12,12,0,1,1,12-12A12,12,0,0,1,128,168Zm0-56a12,12,0,1,1,12-12A12,12,0,0,1,128,112Zm60,56a12,12,0,1,1,12-12A12,12,0,0,1,188,168Zm0-56a12,12,0,1,1,12-12A12,12,0,0,1,188,112Z"></path>
              </svg>
            </div>

            <div className="capitalize cursor-pointer">
              {Expand ? translateKeys.collapse : translateKeys.expand}
            </div>
          </button>

          {Expand ? (
            <div className="w-full p-2 text-sm bg-[#eaeaea]">
              <div className="flex items-center justify-end mb-2">
                <button
                  type="button"
                  className="group cursor-pointer"
                  onClick={async () => {
                    await copyToClipboard(JSON.stringify(value, null, 2));
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="w-5 fill-[#929292] group-hover:fill-black transition-colors duration-200"
                  >
                    <title>Copy</title>
                    <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                  </svg>
                </button>
              </div>
              <pre
                className="whitespace-pre-wrap break-all text-[#929292]"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <off>
                dangerouslySetInnerHTML={{
                  __html: highlightJson(JSON.stringify(value, null, 2)),
                }}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 bg-[#f3f3f3] border-b border-gray-200 last:border-b-0 text-sm">
          <div className="flex items-center gap-2 min-w-sm">
            <pre>{name}</pre>
            <div className="text-[#929292] border border-[#eaeaea] text-xs px-1.5 rounded-full">
              <p>{typeof value}</p>
            </div>
          </div>

          <pre
            className="whitespace-pre-wrap break-all max-w-xl text-gray-600"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <off>
            dangerouslySetInnerHTML={{
              __html: highlightJson(JSON.stringify(value, null, 2)),
            }}
          />
        </div>
      )}
    </>
  );
};
