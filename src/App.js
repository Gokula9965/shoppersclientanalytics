import { Link, Route, Routes} from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import { DataProvider } from './context/DataContext';
import { Dashboard } from '@mui/icons-material';
// import { CssBaseline } from '@mui/material';
function App() {
  return (
    <div>

     <DataProvider>
      <Link to='/'></Link>
      <Link to='/inventory'></Link>
      <Link to='/customers'></Link>
      <Link to='/orders'></Link>
        <Navbar />
        <Routes>
        <Route path="/" element={ <Dashboard/>}/>
        </Routes>
        </DataProvider>
    </div>
  );
}


export default App;
