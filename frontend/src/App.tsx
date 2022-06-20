import './App.css';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import Movies from './pages/Movies';
import AboutMovie from './pages/AboutMovie';
import React, { FC, ReactElement, useEffect } from 'react';
import AuthPage from './pages/Authentication';
import { UserType } from './types';
import { useAppDispatch, useAppSelector } from './store/use-redux';
import { SLICE_USERS_NAME } from './store/auth/reducer';
import Header from './components/Header';

function App() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentUser } = useAppSelector((state) => state[SLICE_USERS_NAME]);

    useEffect(() => {
        if (pathname === '/') {
            navigate('../movies', { replace: true });
        }
    }, [pathname, navigate]);

    const ProtectedRoute: FC<{
    user: UserType | undefined;
    children: ReactElement;
  }> = ({ user, children }) => {
      if (!user) {
          return <Navigate to="/auth" replace />;
      }

      return children;
  };

    return (
        <div className="App">
            <Header email={currentUser?.email || ''} dispatch={dispatch} navigate={navigate} />
            <Routes>
                <Route path={'/'} element={<></>} />
                <Route path={'/auth'} element={<AuthPage />} />
                <Route
                    path={'/movies'}
                    element={
                        <ProtectedRoute user={currentUser || undefined}>
                            <Movies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={'/movies/:id'}
                    element={
                        <ProtectedRoute user={currentUser || undefined}>
                            <AboutMovie />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<p>There&aposs nothing here: 404!</p>} />
            </Routes>
        </div>
    );
}

export default App;
