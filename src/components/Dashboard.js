import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {JsonSerializer, IdentitySerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";
import ChartVisualization from "./ChartVisualization";

const Dashboard = () => {
    const {coachId} = useParams();
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState([]);

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
                        setData((prevData) => [...prevData.slice(-99), payload.data]);
                        // setData((prevData) => [...prevData.slice(-10), payload.data]);
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

    useEffect(() => {
        const newGroupedData = data.reduce((acc, item) => {
            const sportsmanId = item.sportsmanId;
            if (!acc[sportsmanId]) {
                acc[sportsmanId] = [];
            }
            acc[sportsmanId].push(item);
            return acc;
        }, {});

        const sortedGroupedData = Object.keys(newGroupedData)
            .sort((a, b) => {
                const fioA = newGroupedData[a][0]?.fio || "";
                const fioB = newGroupedData[b][0]?.fio || "";
                return fioA.localeCompare(fioB);
            })
            .reduce((acc, sportsmanId) => {
                acc[sportsmanId] = newGroupedData[sportsmanId];
                return acc;
            }, {});

        setGroupedData(sortedGroupedData);
    }, [data]);

    console.log(data);

    return (
        <div>
            <h1>Данные для тренера: {coachId}</h1>
            <div className="flexim">
                {Object.keys(groupedData).map((sportsmanId) => (
                    <div className="dashboard" key={sportsmanId}>
                        <ChartVisualization
                            key={sportsmanId}
                            data={groupedData[sportsmanId]}
                            sportsmanFIO={groupedData[sportsmanId][0]?.fio}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Dashboard;