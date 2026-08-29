import { useEffect } from "react";
import Icon from "./components/Icon";
import { useStore } from "./store/useStore";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Onboarding from "./views/Onboarding";
import Loading from "./views/Loading";
import DashboardShell from "./views/DashboardShell";

// Mirrors the original render() router: state.view selects the top-level
// screen (landing / onboarding / loading / dashboard). Toast + scroll-to-top
// on view/route change are ported from the same function.
export default function App() {
  const view = useStore((s) => s.view);
  const route = useStore((s) => s.route);
  const toast = useStore((s) => s.toast);
  const init = useStore((s) => s.init);
  const sessionLoaded = useStore((s) => s.sessionLoaded);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, route]);

  if (!sessionLoaded) {
    // Brief blank frame while the session/schemes fetch resolves — avoids a
    // flash of default (unsaved) profile state before hydration completes.
    return null;
  }

  let screen;
  if (view === "landing") screen = <Landing />;
  else if (view === "login") screen = <Login />;
  else if (view === "onboarding") screen = <Onboarding />;
  else if (view === "loading") screen = <Loading />;
  else if (view === "dashboard") screen = <DashboardShell />;
  else screen = <Landing />;

  return (
    <div id="app">
      {screen}
      {toast && (
        <div className="toast fade-in">
          <Icon name="check" />
          {toast}
        </div>
      )}
    </div>
  );
}
