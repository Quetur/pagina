const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');
//mailField: 'mail',mail,
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',  
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username,password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Los Rosales te da la bienvenida ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El Usuario '+[username]+' NO EXISTE !!!!.'));
  }
}));
//,mail, mail,
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username', 
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username,  password, done) => {

  const { fullname } = req.body;
  const { mail } = req.body;
  let newUser = {  
    username,    
    password,
    fullname,
    mail
    
  };

  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id_users = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id_users);
});

passport.deserializeUser(async (id_users, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id_users = ?', [id_users]);
  done(null, rows[0]);
});

passport.use('local.producto', new LocalStrategy({
  
  /*usernameField: 'username',  
  passwordField: 'password',
  passReqToCallback: true*/
}, async (req, done) => {
  console.log('passport');
  const rows = await pool.query('SELECT * FROM producto');
  if (rows.length > 0) {
    const user = rows[0];   
      return done(null, req.flash('success', rows));
    
  } else {
    return done(null, null);
  }
}));

