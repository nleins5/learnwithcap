"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
// Removed: import { fetchCurrentUser } from "@/lib/auth-api";

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState("/profile");
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");

        if (redirectParam?.startsWith("/") && !redirectParam.startsWith("//")) {
            setRedirectTo(redirectParam);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading("Đang đăng nhập...");

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại.');
            }

            if (data.token) {
                // Data now contains the merged user profile including roles and ID
                setUser(data, data.token);

                // Check for admin role in the returned data
                const isAdmin = data.roles?.includes('administrator') || data.role === 'administrator';

                toast.success("Đăng nhập thành công! Đang chuyển hướng...", {
                    id: loadingToast,
                });

                if (isAdmin) {
                    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin-cap.vercel.app';
                    window.location.href = `${adminUrl}/?key=${data.token}`;
                } else {
                    router.push(redirectTo);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Tên đăng nhập hoặc mật khẩu không đúng.", {
                id: loadingToast,
            });
            setIsLoading(false);
        }
    };


    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>
                    Nhập thông tin tài khoản của bạn để tiếp tục.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Email hoặc Tên đăng nhập</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Nhập email hoặc tên đăng nhập"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Đăng nhập
                    </Button>
                    <p className="text-sm text-center text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link href={`/register?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-purple-600 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
