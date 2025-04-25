import { useAuth } from "@clerk/clerk-react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import History from "./screens/history";
import Home from "./screens/home";
import Landing from "./screens/landing";

function LandingPageWrapper() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <Navigate to="/home" replace /> : <Landing />;
}

function ProtectedRoute({ component }: { component: JSX.Element }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? component : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPageWrapper /> },
      { path: "home", element: <ProtectedRoute component={<Home />} /> },
      { path: "history", element: <ProtectedRoute component={<History />} /> },
    ],
  },
]);

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;