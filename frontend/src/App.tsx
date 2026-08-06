import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashBoard from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import GamePage from "./pages/games/GamePage";
import GameDetailPage from "./pages/games/GameDetailPage";
import AnimePage from "./pages/anime/AnimePage";
import AnimeDetailPage from "./pages/anime/AnimeDetailPage";

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
          path="/games"
          element={
            <AppLayout>
              <GamePage />
            </AppLayout>
          }
        />

        <Route
          path="/anime"
          element={
            <AppLayout>
              <AnimePage />
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

         <Route
           path="/anime/:id"
           element={
             <AppLayout>
               <AnimeDetailPage />
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
