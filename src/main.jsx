import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ModelContextProvider } from "./context/ModelContextProvider.jsx";
import { TextureContextProvider } from "./context/TextureContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MantineProvider>
      <ModelContextProvider>
        <TextureContextProvider>
          <App />
        </TextureContextProvider>
      </ModelContextProvider>
    </MantineProvider>
  </BrowserRouter>
);
