import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GenrePage from "./pages/GenrePage";
import PersonPage from "./pages/PersonPage";
import FilmPage from "./pages/FilmPage";
import CinemaPage from "./pages/CinemaPage";
import BookingPage from "./pages/BookingPage";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/genre/:id" element={<GenrePage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/film/:id" element={<FilmPage />} />
          <Route path="/cinema/:id" element={<CinemaPage />} />
          <Route path="/bookings/:sessionId" element={<BookingPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;