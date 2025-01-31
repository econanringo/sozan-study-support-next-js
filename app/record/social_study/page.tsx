"use client"

import { useState, useEffect } from "react"
import { collection, addDoc } from "firebase/firestore"
import { auth, firestore } from "@/lib/firebaseConfig"
import { Button } from "@/components/ui/button"
import { onAuthStateChanged, User } from "firebase/auth"
import Link from "next/link"

export default function English() {
  const [user, setUser] = useState<User | null>(null);
  const [localPart, setLocalPart] = useState("");
  const subject = "Social"
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUser(user);
        setLocalPart(user.email.split("@")[0]);
      } else {
        setUser(null);
        setLocalPart("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const saveStudyTime = async () => {

    setLoading(true)
    setResult(null)

    try {
      const currentDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD
      const docRef = await addDoc(collection(firestore, "studyRecords"), {
        subject,
        time,
        date: currentDate,
        localPart,
      })
      setResult(`学習時間を記録しました！ Document ID: ${docRef.id}`)
      resetTimer()
    } catch (error) {
      setResult(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">学習時間記録: 社会</h1>
        <div className="text-4xl font-bold text-center mb-4">{formatTime(time)}</div>
        <div className="flex justify-center space-x-2 mb-4">
          <Button onClick={toggleTimer}>{isRunning ? "一時停止" : "スタート"}</Button>
          <Button onClick={resetTimer} variant="outline">
            リセット
          </Button>
        </div>
        <Button onClick={saveStudyTime} disabled={loading || time === 0} className="w-full">
          {loading ? "保存中..." : "保存"}
        </Button>
        {result && (
          <p className={`text-sm mt-2 ${result.includes("エラー") ? "text-red-500" : "text-green-500"}`}>{result}</p>
        )}
        <Button className="w-full" variant="link"><Link href="/record">教科選択へ戻る</Link></Button>
      </div>
    </div>
  )
}

