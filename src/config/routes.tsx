import { RouteObject } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Project from "@/pages/Project";
import Deals from "@/pages/Deals";
import Deal from "@/pages/Deal";
import Settings from "@/pages/Settings";
import ChatRoom from "@/components/chat/ChatRoom";
import JoinChatRoom from "@/components/chat/JoinChatRoom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/chat/:roomId",
        element: <ChatRoom />,
      },
      {
        path: "chat/join/:accessCode",
        element: <JoinChatRoom />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:id",
        element: <Project />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "deals/:id",
        element: <Deal />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <Landing />,
  }
];