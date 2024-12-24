import {useEffect, useRef} from "react";
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartVisualization = ({data, sportsmanFIO}) => {
    const chartRef = useRef(null);
    const chartData = {
        labels: data?.map((item) => new Date(item.recordedAt[0], item.recordedAt[1], item.recordedAt[2], item.recordedAt[3], item.recordedAt[4], item.recordedAt[5]).toLocaleTimeString()) || [],
        datasets: [
            {
                label: "Пульс",
                data: data?.map((item) => item.puls) || [],
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "VO2",
                data: data?.map((item) => item.vo2) || [],
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Уровень активности",
                data: data?.map((item) => item.activityLevel) || [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Показатели спортсмена ${sportsmanFIO}`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Время записи",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Значения"
                }
            }
        }
    };

    useEffect(() => {
        if (chartRef.current && data?.length) {
            chartRef.current.update();
        }
    }, [data]);

    const pointLabelPlugin = {
        id: "pointLabel",
        afterDatasetsDraw(chart) {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.data.forEach((point, index) => {
                    const value = dataset.data[index];
                    const x = point.x;
                    const y = point.y;

                    ctx.save();
                    ctx.font = "12px Arial";
                    ctx.fillStyle = "black";
                    ctx.textAlign = "center";
                    ctx.fillText(value, x, y - 10); // Текст над точкой
                    ctx.restore();
                });
            });
        },
    };


    return (
        <div style={{width: "90%", height: "400px"}}>
            <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[pointLabelPlugin]}/>
        </div>
    );
};

export default ChartVisualization;
