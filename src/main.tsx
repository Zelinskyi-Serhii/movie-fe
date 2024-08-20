import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App } from "./App.tsx";
import "./index.scss";
import { Providers } from "./redux/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <ToastContainer />
    <App />
  </Providers>
);
