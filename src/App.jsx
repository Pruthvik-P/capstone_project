import { Home } from "./page/Home/Home";
import { ModalProvider } from "./components/Modal/ModalContext";

function App() {
  return (
   <>
    <ModalProvider>
      <Home />
    </ModalProvider>
   </>
  );
}

export default App;