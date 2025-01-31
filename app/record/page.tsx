import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Record() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Record</h1>
                <Link href="/record/japanese" className="w-full">
                <Button className="w-full">
                    国語
                </Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/math" className="w-full">
                <Button className="w-full">数学</Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/japanese" className="w-full">
                <Button className="w-full">
                    英語
                </Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/science" className="w-full">
                <Button className="w-full">理科</Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/social_study" className="w-full">
                <Button className="w-full">社会</Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/miraikouro" className="w-full">
                <Button className="w-full">未来航路</Button>
                </Link>
                <div style={{ height: "12px" }}></div>
                <Link href="/record/other" className="w-full">
                <Button className="w-full">その他</Button>
                </Link>
            </div>
        </>
    );
}
