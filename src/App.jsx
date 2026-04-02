import { AppProvider }    from "./context/AppContext";
import DashboardPage      from "./pages/Dashboard";

export default function App() {
  return (
    <AppProvider>
      <DashboardPage />
    </AppProvider>
  );
}