import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Login from './pages/Login';
import { AuthContextProvider } from './context/authContext';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Favorites from './pages/Favorites';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import NotFound from './pages/NotFound';
import RequireAuth from './routes/RequireAuth';
import MySalinTempel from './pages/MySalinTempel';
function App() {
  return (
    <>
      <AuthContextProvider>
        <main className="mx-auto max-w-md bg-[#18181b] min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<RequireAuth />}>
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/my-salintempel" element={<MySalinTempel />} />
              <Route path="/edit/:id" element={<Create />} />
            </Route>
          </Routes>
          {location.pathname !== '/login' &&
            location.pathname !== '/register' && <NavigationMenu />}
        </main>
      </AuthContextProvider>
      <Toaster />
    </>
  );
}

export default App;
