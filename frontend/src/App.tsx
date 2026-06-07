import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewThreadPage from './pages/NewThreadPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import TagsPage from './pages/TagsPage';
import ThreadPage from './pages/ThreadPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/categories/:id', element: <CategoryPage /> },
      { path: '/threads/:id', element: <ThreadPage /> },
      {
        path: '/threads/new',
        element: (
          <ProtectedRoute>
            <NewThreadPage />
          </ProtectedRoute>
        ),
      },
      { path: '/search', element: <SearchPage /> },
      { path: '/tags', element: <TagsPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
