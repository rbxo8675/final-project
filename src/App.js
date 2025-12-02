import { AppProvider } from './contexts/AppContext';
import Background from './components/Background';
import Clock from './components/Clock/Clock';
import Weather from './components/Weather';
import Quote from './components/Quote';
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

          {/* Weather */}
          <Weather />

          {/* Quote */}
          <Quote />

          {/* Bookmarks will be placed here */}
          {/* TodoList will be placed here */}
        </main>

        {/* Settings Button will be placed here */}
      </div>
    </AppProvider>
  );
}

export default App;
