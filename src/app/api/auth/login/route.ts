import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const WP_URL = process.env.WOOCOMMERCE_URL || "https://course.learnwithcap.com";

interface UserPayload {
    data: {
        user: {
            id: string;
        }
    }
}

async function fetchWpUser(userId: string, token: string, wpUrl: string) {
    // Fetch user details including roles (context=edit requires auth)
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/${userId}?context=edit`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error(`Failed to fetch WP user ${userId}: ${response.status}`);
        return null;
    }
    return response.json();
}

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Vui lòng nhập đầy đủ thông tin.' }, { status: 400 });
        }

        // 1. Get JWT token
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": username,
            "password": password
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY;
        const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET;
        if (!CONSUMER_KEY || !CONSUMER_SECRET) {
            console.warn('WooCommerce credentials not configured. Using mock login fallback.');
            return NextResponse.json({
                token: "mock-jwt-token-for-demo-purposes",
                user_email: `${username}@example.com`,
                user_nicename: username,
                user_display_name: username,
                id: 9999,
                username,
                name: username,
                first_name: username,
                last_name: "",
                email: `${username}@example.com`,
                role: 'customer',
                roles: ['customer']
            });
        }

        const response = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, requestOptions);


        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            // If not JSON, it's likely an HTML error page (e.g. DB error, 404, 500)
            const text = await response.text();
            console.error("Upstream returned non-JSON:", text.substring(0, 200)); // Log snippet

            // Check for known WP errors like DB connection
            if (text.includes("Lỗi kết nối tới cơ sở dữ liệu") || text.includes("Database")) {
                return NextResponse.json({
                    message: 'Hệ thống đang bảo trì hoặc gặp sự cố kết nối. Vui lòng thử lại sau.'
                }, { status: 503 });
            }

            return NextResponse.json({
                message: 'Lỗi phản hồi từ máy chủ xác thực.'
            }, { status: response.status === 200 ? 500 : response.status });
        }

        if (!response.ok) {
            // Strip HTML tags from message if present
            let cleanMessage = data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            if (typeof cleanMessage === 'string' && cleanMessage.includes('<')) {
                cleanMessage = cleanMessage.replace(/<[^>]*>?/gm, '');
            }

            return NextResponse.json({
                message: cleanMessage
            }, { status: response.status });
        }

        // Optimization: Use user data from token response if available (from custom JWT auth plugin)
        if (data.user && data.user.id) {
            const user = data.user;
            return NextResponse.json({
                ...data,
                id: user.id,
                username: user.username,
                name: user.name || user.first_name + ' ' + user.last_name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.roles?.[0] || 'subscriber',
                roles: user.roles,
                avatar_urls: {
                    '96': user.avatar
                },
                url: user.url || '',
                link: user.link || '',
                slug: user.slug || '',
                description: user.description || '',
                meta: user.meta || {},
                registered_date: user.registered_date
            });
        }

        const token = data.token;

        // 2. Decode token to get user ID
        const decoded: UserPayload = jwtDecode(token);
        const userId = decoded.data.user.id;

        // 3. Fetch full user profile using the token and ID
        const userProfile = await fetchWpUser(userId, token, WP_URL);

        // 4. Merge data and return
        if (userProfile) {
            // Merge token data (token, user_email, user_nicename, user_display_name) 
            // with full profile data (id, roles, name, etc.)
            return NextResponse.json({
                ...data,
                ...userProfile,
                role: userProfile.roles?.[0] || 'subscriber',
                id: userProfile.id, // Ensure ID is present
            });
        }

        // Fallback if fetching profile fails, return original token data
        return NextResponse.json(data);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Login API Error:', error.message);
        } else {
            console.error('Login API Error:', error);
        }
        return NextResponse.json({ message: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
    }
}
