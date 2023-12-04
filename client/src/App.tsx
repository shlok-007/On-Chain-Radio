import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import SongDetails from './pages/SongDetails';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Auth />} />
        <Route path='/uploadsongs' element={<Upload />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/subscribe' element={<Subscribe />} />
        <Route path='/playsongs' element={<SongDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
