const Database = require('sqlite-async');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const jwtMW = exjwt({ secret: 'my-secret' });
const app = express();

const config = require("./config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', process.env.PORT || 3001);

let db;

(async () => {
  try {
    db = await Database.open("test.db");
  } catch (e) {
    console.log(e);
  }
})();

app.post('/login', (req, res) => {
  const content = req.body;
  const username = content.username;

  if (username === "admin" && content.password === "111") {
    const token = jwt.sign({ username }, 'my-secret', { expiresIn: 129600 });

    res.json({ username, token });
  } else {
    res.status(403).send("Unauthorized");
  }
});

app.get('/logout', (req, res) => {
  res.status(200).send("ok");
});

app.get('/global-config', jwtMW, async (req, res) => {
  const data = config.menu.map(item => {
    const { id, label, columns } = item;
    return { id, label, columns };
  })
  res.status(200).send(data);
});

app.get('/select/:screen', jwtMW, async (req, res) => {
  const { screen } = req.params;
  const currentScreenObj = config.menu.find(item => item.id === screen);
  const { label, columns } = currentScreenObj;
  const rows = await db.all(currentScreenObj.selectSQL());
  res.status(200).send({ label, columns, rows });
});

app.get('/record/:screen/:rowid', jwtMW, async (req, res) => {
  const { screen, rowid } = req.params;
  const currentScreenObj = config.menu.find(item => item.id === screen);
  const { label, columns } = currentScreenObj;
  const rows = await db.get(currentScreenObj.recordSQL({ rowid }));
  res.status(200).send({ label, columns, rows });
});

app.post('/insert/:screen', jwtMW, async (req, res) => {
  const screenId = req.params.screen;
  const currentScreenObj = config.menu.find(item => item.id === screenId);
  await db.get(currentScreenObj.insertSQL(req.body));
  const { rowid } = await db.get(`SELECT last_insert_rowid() AS rowid`);
  const record = await db.get(currentScreenObj.recordSQL({ rowid }));
  res.status(200).send({ ...record });
});

app.post('/update/:screen/:rowid', jwtMW, async (req, res) => {
  const { screen, rowid } = req.params;
  const currentScreenObj = config.menu.find(item => item.id === screen);
  await db.run(currentScreenObj.updateSQL({ ...req.body, rowid }));
  res.status(200).send({ ...req.body, rowid });
});

app.get('/delete/:screen/:rowid', jwtMW, async (req, res) => {
  const { screen, rowid } = req.params;
  const currentScreenObj = config.menu.find(item => item.id === screen);
  await db.run(currentScreenObj.deleteSQL({ rowid }));
  res.status(200).send({});
});

app.post('/relations', jwtMW, async (req, res) => {
  // const actions = [];
  for (const relation of req.body) {
    const relationScreenObj = config.menu.find(item => item.id === relation);
    console.log(relationScreenObj.relateSQL());
    /*actions.push(() => {
      db.get(relationScreenObj.relateSQL())
    });*/
  }
  res.status(200).send({ ...req.body });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(err);
  } else {
    next(err);
  }
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(app.get('port'));
});
