import express from 'express'
import querystring from 'querystring'
import cors from 'cors'
import axios from 'axios'
import cookie from 'cookie-parser'
import qs from 'querystring'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cpSync } from 'fs'
import { profile } from 'console'
// function to bcrypt password
async function hashPassword(password:string) {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword 
    } catch (error) {
      console.error('Error hashing password:', error);
      return null
    }
  }
  










///  function to decode the access token 
function parseJwt(token:string) {
    const parts = token.split('.');

    // If the JWT doesn't have 3 parts, it's not a valid token
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    // Decode the Base64Url encoded header and payload
    const decodeBase64Url = (base64Url:any) => {
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
console.log(header,payload)
    return {
        header,
        payload
    };
  }








const app= express();
app.use(cookie())



app.use( cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true, // Allow cookies or authentication headers
  })
);




app.get('/',(req,res)=>{

    res.json({
        'hello':'yello'
    })
})

//code for login with google routes
app.get('/auth/google',async(req,res)=>{

    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code',
        scope: ' openid email profile',
        access_type: 'offline',
        prompt: 'consent',
      })}`;

      res.redirect(googleAuthURL)
})

app.get('/auth/google/callback',async(req,res)=>{
    
const { code } =  req.query as { code: string };
console.log(code)
const data=qs.stringify({
    code: code,
    client_id: process.env.CLIENT_ID, // Replace with your client ID
    client_secret:process.env.CLIENT_SECRET, // Replace with your client secret
    redirect_uri: 'http://localhost:3000/auth/google/callback', // Replace with your redirect URI
    grant_type: 'authorization_code',
})


    const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',data
        ,
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    ).then((response) => {



        console.log('Response:', response.data);
        if(response.data.access_token){
            res.cookie('token', response.data.access_token, {
                httpOnly: true,    // Makes the cookie inaccessible to JavaScript
              // Use cookies only over HTTPS in production
                maxAge: 3600000,    // Expiry time (in ms, here it’s 1 hour)
                 sameSite:'strict' // Restrict the cookie to the same site (avoid CSRF attacks)
              });
       
            res.redirect('http://localhost:5173')
        }
      })
      .catch((error) => {
        res.redirect('http://localhost:5173/Sign')
        console.error('Error:', error.response ? error.response.data : error.message);
      });


       
    

  
})



// login with credetials 




app.get('/session', async (req, res) => {
    const cookie =req.cookies;
    const token =cookie['token']
  
    try{let profile=null
        
       await axios.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`).then((re)=>{console.log(re.data);   profile=re.data}).catch((e)=>{console.log(e.message)})
res.json(profile)
    }catch(e){
      res.json({})
    }
   
})
app.post('/signup',async(req,res)=>{

    const{email,password}=  await req.body;
///save to db
const hashedPassword= await hashPassword(password)
if(hashedPassword){
    const body={hashPassword,email}

    
    try{
const token = jwt.sign(body,'32dfcddc')
res.cookie('oken', token, {
    httpOnly: true,    
 
    maxAge: 3600000,    // Expiry time (in ms, here it’s 1 hour)
     sameSite:'strict' 
  });
    }catch(e){

            console.log('sorry jwt erroer')
        }
    }




})
app.listen(3000,()=>{console.log('server stated on locla host:3000')})
