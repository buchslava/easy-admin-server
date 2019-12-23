const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const jwtMW = exjwt({ secret: 'my-secret' });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', process.env.PORT || 3001);

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

app.get('/data', jwtMW, (req, res) => {
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  res.json({
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        width: 150,
      },
      {
        title: 'Address',
        dataIndex: 'address',
      }],
    data
  });
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
