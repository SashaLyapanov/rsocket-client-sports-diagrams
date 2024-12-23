import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {JsonSerializer, IdentitySerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";

const Dashboard = () => {
    const { coachId } = useParams();
    const [data, setData] = useState();

    useEffect(() => {
        // Асинхронная функция внутри useEffect
        const connectAndSubscribe = async () => {
            try {
                console.log("Попытка установить соединение...");
                const client = new RSocketClient({
                    serializers: {
                        data: JsonSerializer,
                        metadata: IdentitySerializer
                    },
                    transport: new RSocketWebSocketClient({
                        url: 'ws://localhost:7000/rsocket',
                        // wsCreator: (url) => new WebSocket(url),
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

                // Кодируем метаданные в байты и добавляем длину
                const metadataString = "fetch-coach-data";

                console.log(JSON.stringify({coachId}))

                // Подписываемся на поток данных
                return rsocket.requestStream({
                    data: JSON.stringify({coachId}),
                    metadata: String.fromCharCode("fetch-coach-data".length) + "fetch-coach-data",
                }).subscribe({
                    onSubscribe: sub => {
                        console.log("Start")
                        sub.request(Number.MAX_SAFE_INTEGER);
                    },
                    onNext: (payload) => {
                        console.log("Получены данные:", payload.data);
                        setData((prevData) => [...prevData, payload.data]);
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
    }, [coachId]);

    return (
        <div>
            <h1>Данные для тренера: {coachId}</h1>
            <p>Привеь :: {data}</p>
        </div>
    );

}

export default Dashboard;