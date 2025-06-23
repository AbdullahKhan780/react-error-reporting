export interface IReactErrorReportingProps {
  onCopy?: () => void;
  eventKey: string;
  emptyComponent?: React.ReactNode;
  translateKeys?: {
    copyAll: string;
    requestDetails: string;
    collapse: string;
    expand: string;
  };
}
