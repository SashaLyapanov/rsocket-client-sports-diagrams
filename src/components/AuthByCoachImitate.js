import './style.css'
import {useState} from "react";

const AuthByCoachImitate = () => {

    const [id, setId] = useState();

    const onSubmit = () => {
        console.log("Id: ", id);
    }

    return (
        <div className="container">
            <div className="main_page">
                <h1 className="header">Добрый день!!!</h1>
                <h2 className="subheader">Введите ваш id</h2>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="inputfield"
                />
                <br/>
                <button onClick={onSubmit} className="button">
                    Подтвердить
                </button>
            </div>
        </div>
    )
}
export default AuthByCoachImitate;