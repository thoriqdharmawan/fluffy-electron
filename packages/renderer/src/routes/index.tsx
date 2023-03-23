
import { createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import PrintPage from "../pages/print";

function Root() {
  return (
    <MainLayout>
      <h1>Hello 232</h1>
    </MainLayout>
  );
}
function Transaction() {
  return (
    <MainLayout>
      <h1>Transaction Page</h1>
    </MainLayout>
  );
}

const ROUTER = createHashRouter([
  {
    path: "/",
    element: <Root />
  },
  {
    path: "/transactions",
    element: <Transaction />
  },
  {
    path: "/print",
    element: <PrintPage />
  },
]);

export default ROUTER