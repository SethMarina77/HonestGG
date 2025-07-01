import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AnalyzePlayer from "./pages/AnalyzePlayer";


const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/*(<Header /> */}
      <Outlet />
      {/*<Footer /> */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "AnalyzePlayer", element: <AnalyzePlayer /> },
    ],
  },
]);

function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
