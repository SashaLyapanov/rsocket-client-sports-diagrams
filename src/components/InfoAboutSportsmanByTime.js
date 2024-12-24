import {useEffect, useState} from "react";
import {IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";

const InfoAboutSportsmanByTime = ({coachId}) => {

    const [data, setData] = useState([]);
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    useEffect(() => {
        if (startDateTime !== "" && endDateTime !== "") {
            gettingData()
        }
    }, [startDateTime, endDateTime]);

    const gettingData = () => {
        const connectAndSubscribe = async () => {
            try {
                console.log("Попытка установить соединение для InfoAboutSportsmanByTime ...");
                const client = new RSocketClient({
                    serializers: {
                        data: JsonSerializer,
                        metadata: IdentitySerializer
                    },
                    transport: new RSocketWebSocketClient({
                        url: 'ws://localhost:7000/rsocket',
                    }),
                    setup: {
                        dataMimeType: 'application/json', //'text/plain',
                        metadataMimeType: 'message/x.rsocket.routing.v0',
                        keepAlive: 10000,
                        lifetime: 20000,
                    },
                });

                // Устанавливаем соединение
                const rsocket = await client.connect();

                if (!rsocket) {
                    console.log("Bad")
                }

                console.log(`Отправка данных: startDateTime=${startDateTime}, endDateTime=${endDateTime}`);

                // Подписываемся на поток данных
                return rsocket.requestStream({
                    data: JSON.stringify({ startDateTime, endDateTime }),
                    metadata: String.fromCharCode("fetch-data-by-time".length) + "fetch-data-by-time",
                }).subscribe({
                    onSubscribe: sub => {
                        console.log("Start")
                        // sub.request(Number.MAX_SAFE_INTEGER);
                        // sub.request(2147483647);
                        sub.request(10);
                    },
                    onNext: (payload) => {
                        console.log("Получены данные:", payload.data);
                        setData((prevData) => [...prevData.slice(-10), payload.data]);
                        // setData((prevData) => [...prevData.slice(-99), payload.data]);
                    },
                    onError: (error) => console.error("Ошибка:", error),
                    onComplete: () => console.log("Поток завершен"),
                });
            } catch (error) {
                console.error("Ошибка при подключении:", error);
            }
        };

        let subscription;

        connectAndSubscribe().then((sub) => {
            subscription = sub;
        });

        // Очистка подписки при размонтировании компонента
        return () => {
            if (subscription) {
                subscription.cancel();
            }
        };
    };

    const handleStartDateTimeChange = (event) => {
        setStartDateTime(event.target.value);
    };

    const handleEndDateTimeChange = (event) => {
        setEndDateTime(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Логика с использованием значений startDateTime и endDateTime
        console.log("Start DateTime:", startDateTime);
        console.log("End DateTime:", endDateTime);
    };


    return (
        <div>
            <h2>Введите дату и время для поиска данных</h2>
            <form onSubmit={handleSubmit}>
                <div className="inputfieldfortime">
                    <label>
                        Начальные дата и время для поиска:
                        <br/>
                        <br/>
                    </label>
                    <input
                        type="datetime-local"
                        value={startDateTime}
                        onChange={handleStartDateTimeChange}
                        required={true}
                    />
                </div>
                <div className="inputfieldfortime">
                    <label>
                        Конечные дата и время для поиска:
                        <br/>
                        <br/>
                    </label>
                    <input
                        type="datetime-local"
                        value={endDateTime}
                        onChange={handleEndDateTimeChange}
                        required={true}
                    />
                </div>
                <button type="submit">Подтвердить</button>
            </form>

            <div>
                <h3>Полученные данные:</h3>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{JSON.stringify(item)}</li>
                    ))}
                </ul>
            </div>

        </div>

    );


}

export default InfoAboutSportsmanByTime;