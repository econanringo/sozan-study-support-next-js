"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"
import { auth, firestore } from "@/lib/firebaseConfig"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function Chat() {
    const [messages, setMessages] = useState<{ id: string; text: string; uid: string; displayName: string }[]>([])
    const { input, handleInputChange, handleSubmit } = useChat()

    useEffect(() => {
        const q = query(collection(firestore, "messages"), orderBy("createdAt"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages: { id: string; text: string; uid: string; displayName: string }[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                fetchedMessages.push({ id: doc.id, text: data.text, uid: data.uid, displayName: data.displayName })
            })
            setMessages(fetchedMessages)
        })
        return () => unsubscribe()
    }, [])

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.trim() === "") return
        if (auth.currentUser) {
            const { uid, displayName } = auth.currentUser
            await addDoc(collection(firestore, "messages"), {
                text: input,
                createdAt: new Date(),
                uid,
                displayName,
            })
            handleSubmit(e)
        }
    }

    return (
        <div className="container mx-auto p-4 pb-16">
            <Header />
            {messages.map((msg) => (
                <div key={msg.id} className={`mb-2 ${auth.currentUser && msg.uid === auth.currentUser.uid ? "text-right" : "text-left"}`}>
                    <span
                        className={`inline-block p-2 rounded-lg ${auth.currentUser && msg.uid === auth.currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        {msg.text}
                    </span>
                    <p className="text-xs text-gray-500">{msg.displayName}</p>
                </div>
            ))}
            {/* フォームを画面下部に固定 */}
            <form onSubmit={sendMessage} className="fixed bottom-0 w-full bg-white p-4 flex space-x-2 border-t container">
                <Input value={input} onChange={handleInputChange} placeholder="Type your message..." className="flex-grow" />
                <Button type="submit">Send</Button>
            </form>
        </div>

    )
}

