"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebaseConfig"; // Firestoreの初期化
import { onAuthStateChanged } from "firebase/auth";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import { Header } from "@/components/header";

// Firestoreのデータ型
interface Data {
  localPart: string;
  time: number; // 時間が秒で格納されている
}

// Firestoreからデータを取得
async function getData(): Promise<Data[]> {
  const q = query(collection(firestore, "studyRecords"));
  const querySnapshot = await getDocs(q);
  const data: Data[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as Data);
  });

  return data;
}

// `localPart`ごとの`time`合計を計算
function calculateTotalTime(data: Data[]) {
  const totalTime = data.reduce((acc, entry) => acc + entry.time, 0); // 時間（秒）の合計
  return totalTime;
}

// 180分（10800秒）に対する進行割合を計算
function calculateProgress(totalTime: number) {
  const maxTime = 180 * 60; // 180分（秒に換算）
  const progress = (totalTime / maxTime) * 100; // 進行割合（％）
  return progress;
}

// `localPart`ごとの時間を棒グラフ用に整形
function prepareBarChartData(data: Data[]) {
  const labels = data.map(entry => entry.localPart);
  const times = data.map(entry => (entry.time / 60).toFixed(2)); // 秒を分に変換

  return {
    labels,
    datasets: [
      {
        label: 'Study Time (Minutes)',
        data: times,
        backgroundColor: '#36a2eb', // 棒の色
      },
    ],
  };
}

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

export default function Home() {
  const [chartData, setChartData] = useState<any>(null); // 円グラフのデータ
  const [barChartData, setBarChartData] = useState<any>(null); // 棒グラフのデータ
  const [progress, setProgress] = useState(0); // 進行状況（％）
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    async function fetchData() {
      const data = await getData();

      const totalTime = calculateTotalTime(data);
      const progressPercentage = calculateProgress(totalTime);

      // 円グラフ用データ設定
      const chartData = {
        labels: ['Progress', 'Remaining'], // 進行中と残り
        datasets: [
          {
            data: [progressPercentage, 100 - progressPercentage], // 進行状況と残りの割合
            backgroundColor: ['#36a2eb', '#e0e0e0'], // 進行中の色と残りの色
            hoverBackgroundColor: ['#2c83e0', '#bdbdbd'],
          },
        ],
      };

      // 棒グラフ用データ設定
      const barData = prepareBarChartData(data);

      setChartData(chartData);
      setBarChartData(barData);
      setProgress(progressPercentage);
    }

    fetchData();

    return () => unsubscribe();
  }, [router]);

  return (
    <><Header /><Card className="flex flex-col p-6">
      <CardContent className="flex flex-row justify-between gap-8">
        {/* 左側の円グラフ */}
        <div className="flex-1 max-w-[300px]">
          {chartData && (
            <>
              <h3 className="text-center text-xl font-semibold mb-4">Study Progress</h3>
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context: any) {
                          const label = context.label || "";
                          const value = context.raw;
                          return `${label}: ${(value).toFixed(2)}%`;
                        },
                      },
                    },
                  },
                }}
                width={100} height={100} // 円グラフのサイズを調整
              />
              <div className="text-center mt-4">
                <p className="text-lg font-medium">
                  You have completed <strong>{progress.toFixed(2)}%</strong> of your 180 minutes study goal.
                </p>
              </div>
            </>
          )}
        </div>

        {/* 右側の棒グラフ */}
        <div className="flex-1 max-w-[400px]">
          {barChartData && (
            <>
              <h3 className="text-center text-xl font-semibold mb-4">Study Time per Subject</h3>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context: any) {
                          const value = context.raw;
                          return `${value} min`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Subject',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Time (minutes)',
                      },
                      beginAtZero: true,
                    },
                  },
                }} />
            </>
          )}
        </div>
      </CardContent>
    </Card></>
  );
}
