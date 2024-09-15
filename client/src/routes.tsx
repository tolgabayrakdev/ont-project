import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const HomePage = lazy(() => import("./pages/home"));
const NotFoundPage = lazy(() => import('./pages/error/not-found'));

const SignInPage = lazy(() => import('./pages/authentication/sign-in'));
const SignUpPage = lazy(() => import('./pages/authentication/sign-up'));


const AppLayout = lazy(() => import('./layouts/app-layout'));
const AppIndexPage = lazy(() => import('./pages/app/Index'));

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
            { path: "", element: <AppIndexPage />, index: true }
        ]
    }
]);

export default routes;