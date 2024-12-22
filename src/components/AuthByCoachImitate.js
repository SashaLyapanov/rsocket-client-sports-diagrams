import './style.css'
import {useState} from "react";
import {useNavigate} from "react-router";

const AuthByCoachImitate = () => {

    const [id, setId] = useState();
    const navigate = useNavigate();

    const onSubmit = () => {
        console.log("Id: ", id);
        // socketClient.connect().then((rsocket) => {
        //     rsocket.requestStream({
        //         data: {coach_id: id},
        //         metadata: "fetch-coach-data",
        //     }).subscribe({
        //         onNext: (frame) => {
        //             console.log("Received data: ", frame.data);
        //         },
        //         onError: (error) => {
        //             console.error("Error receiving data: ", error);
        //         },
        //         onComplete: () => {
        //             console.log("Stream complete!");
        //         }
        //     });
        // });
        navigate(`/dashboard/${id}`);
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