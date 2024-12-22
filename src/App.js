import './App.css';
import {Route, Routes} from "react-router";
import AuthByCoachImitate from "./components/AuthByCoachImitate";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route exac path='/' element={<AuthByCoachImitate/>}/>
                <Route exac path='/dashboard/:coachId' element={<Dashboard/>}/>
            </Routes>
        </div>
    );
}

export default App;
