
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "/@/layouts/MainLayout";

import PrintPage from "/@/pages/print";
import Homepage from "/@/pages/homepage/Homepage";
import Login from "/@/pages/login";

function Transaction() {
  return (
    <MainLayout>
      <h1>Transaction Page</h1>
    </MainLayout>
  );
}

const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/login",
    element: <Login />
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