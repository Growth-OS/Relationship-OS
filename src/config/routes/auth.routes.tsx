import { RouteObject } from "react-router-dom";
import Login from "@/pages/Login";
import Join from "@/pages/Join";
import Landing from "@/pages/Landing";

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Landing />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "join",
    element: <Join />,
  },
];