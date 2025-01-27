"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const querystring_1 = __importDefault(require("querystring"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const querystring_2 = __importDefault(require("querystring"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// function to bcrypt password
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            return hashedPassword;
        }
        catch (error) {
            console.error('Error hashing password:', error);
            return null;
        }
    });
}
///  function to decode the access token 
function parseJwt(token) {
    const parts = token.split('.');
    // If the JWT doesn't have 3 parts, it's not a valid token
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }
    // Decode the Base64Url encoded header and payload
    const decodeBase64Url = (base64Url) => {
        // Base64Url to Base64 conversion (JWT uses Base64Url, which is slightly different from standard Base64)
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad the string with "=" if needed
        while (base64.length % 4) {
            base64 += '=';
        }
        return Buffer.from(base64, 'base64').toString('utf-8');
    };
    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    console.log(header, payload);
    return {
        header,
        payload
    };
}
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true, // Allow cookies or authentication headers
}));
app.get('/', (req, res) => {
    res.json({
        'hello': 'yello'
    });
});
//code for login with google routes
app.get('/auth/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?${querystring_1.default.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code',
        scope: ' openid email profile',
        access_type: 'offline',
        prompt: 'consent',
    })}`;
    res.redirect(googleAuthURL);
}));
app.get('/auth/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    console.log(code);
    const data = querystring_2.default.stringify({
        code: code,
        client_id: process.env.CLIENT_ID, // Replace with your client ID
        client_secret: process.env.CLIENT_SECRET, // Replace with your client secret
        redirect_uri: 'http://localhost:3000/auth/google/callback', // Replace with your redirect URI
        grant_type: 'authorization_code',
    });
    const tokenResponse = yield axios_1.default.post('https://oauth2.googleapis.com/token', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((response) => {
        console.log('Response:', response.data);
        if (response.data.access_token) {
            res.cookie('token', response.data.access_token, {
                httpOnly: true, // Makes the cookie inaccessible to JavaScript
                // Use cookies only over HTTPS in production
                maxAge: 3600000, // Expiry time (in ms, here it’s 1 hour)
                sameSite: 'strict' // Restrict the cookie to the same site (avoid CSRF attacks)
            });
            res.redirect('http://localhost:5173');
        }
    })
        .catch((error) => {
        res.redirect('http://localhost:5173/Sign');
        console.error('Error:', error.response ? error.response.data : error.message);
    });
}));
// login with credetials 
app.get('/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    const token = cookie['token'];
    try {
        let profile = null;
        yield axios_1.default.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`).then((re) => { console.log(re.data); profile = re.data; }).catch((e) => { console.log(e.message); });
        res.json(profile);
    }
    catch (e) {
        res.json({});
    }
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    ///save to db
    const hashedPassword = yield hashPassword(password);
    if (hashedPassword) {
        const body = { hashPassword, email };
        try {
            const token = jsonwebtoken_1.default.sign(body, '32dfcddc');
            res.cookie('oken', token, {
                httpOnly: true,
                maxAge: 3600000, // Expiry time (in ms, here it’s 1 hour)
                sameSite: 'strict'
            });
        }
        catch (e) {
            console.log('sorry jwt erroer');
        }
    }
}));
app.listen(3000, () => { console.log('server stated on locla host:3000'); });
