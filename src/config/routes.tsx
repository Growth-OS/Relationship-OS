import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Deals from "@/pages/Deals";
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
        path: "deals",
        element: <Deals />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <Landing />,
  }
];