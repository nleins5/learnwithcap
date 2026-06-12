import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.WOOCOMMERCE_URL || "https://course.learnwithcap.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET;

const auth = 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

export async function POST(req: NextRequest) {
    try {
        const { username, email, password, full_name } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Vui lòng nhập đầy đủ thông tin.' }, { status: 400 });
        }

        const names = (full_name || '').split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';

        if (!CONSUMER_KEY || !CONSUMER_SECRET) {
            console.warn('WooCommerce credentials not configured. Using mock register fallback.');
            
            return NextResponse.json({
                token: "mock-jwt-token-for-demo-purposes",
                user_email: email,
                user_nicename: username,
                user_display_name: full_name || username,
                id: 9999,
                username,
                name: full_name || username,
                first_name: firstName,
                last_name: lastName,
                email,
                role: 'customer',
                roles: ['customer']
            }, { status: 201 });
        }


        // 1. Create User via WooCommerce REST API
        const response = await fetch(`${API_URL}/wp-json/wc/v3/customers`, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Check if user already exists (WP or WooCommerce error codes)
            if (
                data.code === 'existing_user_login' || 
                data.code === 'existing_user_email' ||
                data.code === 'registration-error-email-exists' ||
                data.code === 'registration-error-username-exists'
            ) {
                return NextResponse.json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' }, { status: 400 });
            }
            return NextResponse.json({ message: data.message || 'Đăng ký thất bại. Vui lòng thử lại.' }, { status: response.status });
        }

        // 2. Automatically get JWT token after registration
        const tokenResponse = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            // If we can't get token automatically, user is created but needs manual login
            return NextResponse.json({
                success: true,
                message: 'Đăng ký thành công. Vui lòng đăng nhập.',
                user: data
            }, { status: 201 });
        }

        return NextResponse.json(tokenData, { status: 201 });

    } catch (error: any) {
        console.error('Register API Error:', error);
        return NextResponse.json({ message: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
    }
}
