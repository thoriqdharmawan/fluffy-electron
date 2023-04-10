
import React from 'react'
import { createBrowserRouter } from "react-router-dom";

const Homepage = React.lazy(() => import("/@/pages/homepage/Homepage"))
const Transactions = React.lazy(() => import("/@/pages/transactions/Transactions"))
const Login = React.lazy(() => import("/@/pages/login"))
const PrintPage = React.lazy(() => import("/@/pages/print"))

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