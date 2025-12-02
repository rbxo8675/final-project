import { AppProvider } from './contexts/AppContext';
import Background from './components/Background';
import Clock from './components/Clock/Clock';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        {/* Background */}
        <Background />

        {/* Main Content */}
        <main className="main-content">
          {/* Clock */}
          <Clock />

          {/* Weather will be placed here */}
          {/* Quote will be placed here */}
          {/* Bookmarks will be placed here */}
          {/* TodoList will be placed here */}
        </main>

        {/* Settings Button will be placed here */}
      </div>
    </AppProvider>
  );
}

export default App;
