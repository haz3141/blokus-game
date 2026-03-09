import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell, EmptyState, LoadingState } from "./components/app-shell/index.js";
import { Button } from "./components/ui/button.js";

const HomePage = lazy(async () => {
  const module = await import("./routes/HomePage.js");
  return { default: module.HomePage };
});

const PlayRoomPage = lazy(async () => {
  const module = await import("./routes/PlayRoomPage.js");
  return { default: module.PlayRoomPage };
});

function RouteFallback() {
  return (
    <AppShell centered width="content">
      <LoadingState
        description="Loading the current route shell and restoring the latest client state."
        title="Opening room"
      />
    </AppShell>
  );
}

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
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play/:roomId" element={<PlayRoomPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
