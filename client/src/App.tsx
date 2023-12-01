import './App.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import Footer from './components/Footer';
import { Songs } from './components/Songs';
import SongDetails from './pages/SongDetails';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Songs />
      <Footer />
      <SongDetails />
    </div>
  );
}

export default App;
