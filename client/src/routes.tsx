import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const HomePage = lazy(() => import('./pages/home'));
const SignInPage = lazy(() => import('./pages/authentication/sign-in'));
const SignUpPage = lazy(() => import('./pages/authentication/sign-up'));
const NotFoundPage = lazy(() => import('./pages/not-found'));


const AppLayout = lazy(() => import('./layouts/app-layout'));
const AppIndexPage = lazy(() => import('./pages/app/index'));
const AppProfilePage = lazy(() => import('./pages/app/profile'));

const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    },
    {
        path: "/sign-in",
        element: <SignInPage />
    },
    {
        path: "/sign-up",
        element: <SignUpPage />
    },
    {
        path: "/app",
        element: <AppLayout />,
        children: [
            { path: "", element: <AppIndexPage />, index: true },
            { path: "profile", element: <AppProfilePage /> },
        ]
    }
]);

export default routes;