import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Landing from './components/Landing';
import NotFound from './components/404';
import NewProject from './components/NewProject';
import ProjectView from "./components/ProjectView";

const router = createBrowserRouter([
    {
        path: "*",
        element: <NotFound />,
    },
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/about",
        element: <div>About</div>,
    },
    {
        path: "/dashboard",
        element: <div>Dashboard</div>,
    },
    {
        path: "/newproject",
        element: <NewProject />,
    },
    {
        path: "/project/:id",
        element: <ProjectView />,
    },
]);


function Router() {
    return (
        <div className="main">
            <RouterProvider router={router} />
        </div>
    )
}

export default Router;