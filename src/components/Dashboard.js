import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {JsonSerializers, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";

const Dashboard = () => {
    const {coachId} = useParams();
    const [data, setData] = useState();

    //Попытка для TCP
    // async function createClient(options) {
    //     const client = new RSocketTcpClient({
    //         setup: {
    //             dataMimeType: 'application/json',
    //             keepAlive: 1000000, // avoid sending during test
    //             lifetime: 100000,
    //             metadataMimeType: 'application/json',
    //         },
    //         transport: new RSocketTcpClient({
    //             host: "localhost",
    //             port: "7000"
    //         }),
    //     });
    //     return await client.connect();
    // }

    //Попытка для WebSocket
    async function createClient(options) {
        const client = new RSocketClient({
            setup: {
                dataMimeType: 'application/json',
                keepAlive: 1000000, // avoid sending during test
                lifetime: 100000,
                metadataMimeType: 'application/json',
            },
            transport: new RSocketWebSocketClient({
                    url: 'ws://localhost:7000',
                },
                JsonSerializers
            ),
        });
        return await client.connect();
    }

    useEffect(() => {
        // Асинхронная функция внутри useEffect
        const connectAndSubscribe = async () => {
            try {
                // Устанавливаем соединение для TCP
                // const rsocket = await createClient({
                //     host: "localhost",
                //     port: 7000
                // });

                // Устанавливаем соединение для WebSocket
                const rsocket = await createClient();

                // Подписываемся на поток данных
                const subscription = rsocket.requestStream({
                    data: {coach_id: coachId},
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