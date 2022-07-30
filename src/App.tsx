import { FC } from "react";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

const App: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
