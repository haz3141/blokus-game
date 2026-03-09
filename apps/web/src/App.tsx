import { Route, Routes } from "react-router-dom";

import { HomePage } from "./routes/HomePage.js";
import { PlayRoomPage } from "./routes/PlayRoomPage.js";

function NotFoundPage() {
  return (
    <main className="app-shell center-shell">
      <div className="card-panel">
        <p className="eyebrow">Cornerfall</p>
        <h1>Room not found</h1>
        <p className="muted-copy">The route you opened does not exist in this build.</p>
        <a className="button-primary" href="/">
          Back home
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play/:roomId" element={<PlayRoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
