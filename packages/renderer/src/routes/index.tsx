
import { createBrowserRouter } from "react-router-dom";
import PrintPage from "/@/pages/print";
import Homepage from "/@/pages/homepage/Homepage";
import Login from "/@/pages/login";
import Transactions from "/@/pages/transactions/Transactions";


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
    element: <Transactions />
  },
  {
    path: "/print",
    element: <PrintPage />
  },
]);

export default ROUTER