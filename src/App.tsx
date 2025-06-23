import React from "react";
import { ReactErrorReporting } from "./components/ReactErrorReporting";
import { API_INSTANCE, EVENT_EMITTER } from "./libs/api";

function App() {
  React.useEffect(() => {
    API_INSTANCE.get("/test-endpoint");
  }, []);

  return (
    <ReactErrorReporting eventKey="ReqError" eventTarget={EVENT_EMITTER} />
  );
}

export default App;
