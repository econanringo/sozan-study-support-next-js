"use client"
import Link from "next/link"
import { User, Settings, LogOut, Grid, Calendar, MessageSquare, CheckSquare, BarChart2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { signOut, getAuth } from "firebase/auth"

const apps = [
    { name: "Calendar", icon: Calendar, url: "/calendar" },
    { name: "Messages", icon: MessageSquare, url: "/messages" },
    { name: "Tasks", icon: CheckSquare, url: "/tasks" },
    { name: "Analytics", icon: BarChart2, url: "/analytics" },
    { name: "Files", icon: FolderOpen, url: "/files" },
]

export function Header() {
    return (
        <header className="bg-background border-b fixed top-0 left-0 right-0 z-10">
            <div className="flex h-16 items-center justify-between px-4 f">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="font-bold text-xl">
                        Sozan Study Support
                    </Link>
                </div>
                <nav className="flex items-center space-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0">
                                <Grid className="h-5 w-5" />
                                <span className="sr-only">App List</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid grid-cols-3 gap-4">
                                {apps.map((app) => (
                                    <Link href={app.url} key={app.name}>
                                        <Button key={app.name} variant="ghost" className="h-20 w-20 flex-col">
                                            <app.icon className="h-8 w-8 mb-1" />
                                            <div className="text-xs">{app.name}</div>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Account menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Account Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => signOut(getAuth())} style={{ cursor: "pointer" }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </div>
        </header>
    )
}

