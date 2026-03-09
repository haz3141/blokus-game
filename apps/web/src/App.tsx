import { Route, Routes } from "react-router-dom";

import { AppShell, EmptyState } from "./components/app-shell/index.js";
import { Button } from "./components/ui/button.js";
import { HomePage } from "./routes/HomePage.js";
import { PlayRoomPage } from "./routes/PlayRoomPage.js";

function NotFoundPage() {
  return (
    <AppShell centered width="content">
      <EmptyState
        actions={
          <Button asChild>
            <a href="/">Back home</a>
          </Button>
        }
        description="The route you opened does not exist in this build."
        title="Room not found"
      />
    </AppShell>
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
