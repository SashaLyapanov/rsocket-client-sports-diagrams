import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {JsonSerializers, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";

const Dashboard = () => {
    const { coachId } = useParams();
    const [data, setData] = useState();

    useEffect(() => {
        // Асинхронная функция внутри useEffect
        const connectAndSubscribe = async () => {
            try {
                const client = new RSocketClient({
                    serializers: JsonSerializers,
                    transport: new RSocketWebSocketClient({
                        url: 'ws://localhost:7000',
                    }),
                    setup: {
                        dataMimeType: 'application/json',
                        metadataMimeType: 'application/json',
                        keepAlive: 10000,
                        lifetime: 20000,
                    },
                });

                // Устанавливаем соединение
                const rsocket = await client.connect();

                // Подписываемся на поток данных
                const subscription = rsocket.requestStream({
                    data: { coach_id: coachId },
                    metadata: String.fromCharCode("fetch-coach-data".length) + "fetch-coach-data",
                }).subscribe({
                    onNext: (payload) => {
                        console.log("Получены данные:", payload.data);
                        setData((prevData) => [...prevData, payload.data]);
                    },
                    onError: (error) => console.error("Ошибка:", error),
                    onComplete: () => console.log("Поток завершен"),
                });

                return subscription; // Возвращаем подписку для последующей отмены
            } catch (error) {
                console.error("Ошибка подключения:", error);
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
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );

}

export default Dashboard;