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

const ChartVisualization = ({data, coach_id}) => {
    const chartRef = useRef(null);

    const chartData = {
        labels: data?.map((item) => new Date(item.recordedAt).toLocaleTimeString()) || [],
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
                text: `Показатели спортсмена`,
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

    return (
        <div style={{width: "90%", height: "400px"}}>
            <Line ref={chartRef} data={chartData} options={chartOptions}/>
        </div>
    );
};

export default ChartVisualization;
