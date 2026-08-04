import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashBoard from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import MoviePage from "@/pages/movies/MoviePage";
import RegisterPage from "@/pages/auth/RegisterPage";
import MovieDetailPage from "@/pages/movies/MovieDetailPage";
import GamePage from "./pages/games/GamePage";
import GameDetailPage from "./pages/games/GameDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashBoard />
            </AppLayout>
          }
        />

        <Route
          path="/movies"
          element={
            <AppLayout>
              <MoviePage />
            </AppLayout>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <AppLayout>
              <MovieDetailPage />
            </AppLayout>
          }
        />

        <Route
          path="/games"
          element={
            <AppLayout>
              <GamePage />
            </AppLayout>
          }
        />

        <Route
          path="/game/:id"
          element={
            <AppLayout>
              <GameDetailPage />
            </AppLayout>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
