const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        usuario_id: req.user.idUsuario
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully!'); 
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
        const links = await pool.query('SELECT * FROM links WHERE usuario_id = ?', [req.user.idUsuario]);
        res.render('links/list', {links});
    });

router.get('/delete/:idLink', isLoggedIn, async (req, res) => {
    const { idLink } = req.params;
    await pool.query('DELETE FROM links WHERE idLink = ?', [idLink]);
    req.flash('success', 'Link removed successfully!');
    res.redirect('/links');
});

router.get('/edit/:idLink', isLoggedIn, async (req, res) => {
    const { idLink } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE idLink = ?', [idLink]);

    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:idLink', isLoggedIn, async (req, res) => {
    const { idLink } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links SET ? WHERE idLink = ?', [newLink, idLink]);
    req.flash('success', 'Link updated successfully');
    res.redirect('/links');
});

module.exports = router;