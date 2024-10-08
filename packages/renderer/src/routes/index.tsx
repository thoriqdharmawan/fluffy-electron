import React from "react";
import { createHashRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

const Homepage = React.lazy(() => import("/@/pages/homepage/Homepage"));
const Transactions = React.lazy(() => import("/@/pages/transactions/Transactions"));
const Attendances = React.lazy(() => import("/@/pages/attendances"));
const Wallets = React.lazy(() => import("/@/pages/wallets"));
const Login = React.lazy(() => import("/@/pages/login"));
const ProductsPage = React.lazy(() => import("/@/pages/products"));
const AddProductPage = React.lazy(() => import("/@/pages/add-product"));
const PrintPage = React.lazy(() => import("/@/pages/print"));
const SettingPage = React.lazy(() => import("/@/pages/setting"));

const ROUTER = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "attendances",
        element: <Attendances />,
      },
      {
        path: "wallets",
        element: <Wallets />,
      },
      {
        path: "print",
        element: <PrintPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "add-product",
        element: <AddProductPage />,
      },
      {
        path: "setting",
        element: <SettingPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default ROUTER;
