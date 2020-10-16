const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({

    usernameField: 'nombre',
    passwordField: 'contraseña',
    passReqToCallback: true

}, async(req, nombre, contraseña, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.comparePassword(contraseña, user.contraseña);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome ' + user.nombre + '!'));
        }else {
            done(null, false, req.flash('message', 'Incorrect password!'));
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exists!'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async(req, nombre, contraseña, done) => {
    const { fullname } = req.body;
    const newUser = {
        nombre,
        contraseña,
        fullname
    };

    newUser.contraseña = await helpers.encryptPassword(contraseña);
    const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
    newUser.idUsuario = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user,done) => {
    done(null, user.idUsuario);
});

passport.deserializeUser(async(idUsuario, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario]);
    done(null, rows[0]);
});