import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home-page";
import { CommBuilderPage } from "./pages/comm-builder-page";
import { DashboardPage } from "./pages/dashboard-page";
import { SettingsPage } from "./pages/settings-page";
import { AwarenessTestPage } from "./pages/awareness-test-page";
import { CVBuilderPage } from "./pages/cv-builder-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/comm-builder",
    Component: CommBuilderPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/awareness-test",
    Component: AwarenessTestPage,
  },
  {
    path: "/cv-builder",
    Component: CVBuilderPage,
  },
]);