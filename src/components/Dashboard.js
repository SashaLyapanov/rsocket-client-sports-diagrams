import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {JsonSerializer, IdentitySerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";
import ChartVisualization from "./ChartVisualization";

const Dashboard = () => {
    const { coachId } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
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

                console.log(JSON.stringify({coachId}))

                // Подписываемся на поток данных
                return rsocket.requestStream({
                    data: JSON.stringify({coachId}),
                    metadata: String.fromCharCode("fetch-coach-data".length) + "fetch-coach-data",
                }).subscribe({
                    onSubscribe: sub => {
                        console.log("Start")
                        // sub.request(Number.MAX_SAFE_INTEGER);
                        sub.request(2147483647);
                    },
                    onNext: (payload) => {
                        console.log("Получены данные:", payload.data);
                        // setData((prevData) => [...prevData.slice(-99), payload.data]);
                        setData((prevData) => [...prevData.slice(-10), payload.data]);
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
            <ChartVisualization data={data} coach_id={coachId} />
        </div>
    );

}

export default Dashboard;