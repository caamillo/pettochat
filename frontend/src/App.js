// React
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home';
import Test from './pages/Test';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = { <Home /> } />
                <Route path="/test" element = { <Test /> } />
                <Route path="/:proom" element = { <Home /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App