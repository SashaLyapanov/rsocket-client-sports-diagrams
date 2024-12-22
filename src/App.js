import './App.css';
import {Route, Routes} from "react-router";
import AuthByCoachImitate from "./components/AuthByCoachImitate";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route exac path='/' element={<AuthByCoachImitate/>}/>
            </Routes>
        </div>
    );
}

export default App;
