import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.set('trust proxy', 1)
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   sameSite: "none",
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7
    // }
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((accessToken, done) => {
  return done(null, accessToken);
})

passport.deserializeUser((accessToken, done) => {
  return done(null, accessToken);
})

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://anilist.co/api/v2/oauth/authorize',
    tokenURL: 'https://anilist.co/api/v2/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/anilist/callback',
  },
  function(accessToken, refreshToken, profile, cb) {
    cb(null, accessToken)
  }
));

app.get('/auth/anilist',
  passport.authenticate('oauth2'));

app.get('/auth/anilist/callback',
  passport.authenticate('oauth2',{ failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  });

app.get('/', (req, res) => {
  res.send("Hello world");
});

app.get('/gettoken', (req, res) => {
  res.send(req.user);
});

app.get('/auth/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send('done');
  }
})

app.listen(4000, () => {
  console.log("Server started.");
});