import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const HomePage = lazy(() => import("./pages/home"));
const NotFoundPage = lazy(() => import('./pages/error/not-found'));


const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);

export default routes;