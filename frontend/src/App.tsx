import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashBoard from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import GamePage from "./pages/games/GamePage";
import GameDetailPage from "./pages/games/GameDetailPage";
import AnimePage from "./pages/anime/AnimePage";
import MangaPage from "@/pages/manga/MangaPage";
import MangaDetailPage from "@/pages/manga/MangaDetailPage";
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

         <Route
           path="/manga"
           element={
             <AppLayout>
               <MangaPage />
             </AppLayout>
           }
         />

         <Route
           path="/manga/:id"
           element={
             <AppLayout>
               <MangaDetailPage />
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
