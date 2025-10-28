import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <ThemeProvider>
          <TaskProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="p-8 text-center text-lg">Loading...</div>}>
                <App />
              </Suspense>
            </BrowserRouter>
          </TaskProvider>
        </ThemeProvider>
      </LanguageProvider>
    </I18nextProvider>
  </StrictMode>
);
