import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function Email() {
    const [user, setUser] = useState<User | null>(null);
    const [localPart, setLocalPart] = useState("");

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

    return (
        <div>
            {user ? (
                <div>
                    <p>ようこそ, {localPart} さん!</p>
                </div>
            ) : (
                <p>ログインしていません</p>
            )}
        </div>
    );
}