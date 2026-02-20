import { createBrowserRouter } from "react-router";
import { LoginPage, SignupPage } from "./pages/auth-page";
import { AwarenessTestPage } from "./pages/awareness-test-page";
import { CommBuilderPage } from "./pages/comm-builder-page";
import { CVBuilderPage } from "./pages/cv-builder-page";
import { DashboardPage } from "./pages/dashboard-page";
import { HomePage } from "./pages/home-page";
import { OnboardingPage } from "./pages/onboarding-page";
import { ProfilePage } from "./pages/profile-page";
import { SettingsPage } from "./pages/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/onboarding",
    Component: OnboardingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
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
  {
    path: "/profile",
    Component: ProfilePage,
  },
]);