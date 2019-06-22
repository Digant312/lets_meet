// const { dbQuery } = require('../../db');
const { dbQuery } = require('@db');
const config = require('@config').module;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function getCurrentTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

const generateAuthToken = async ({ userId }) => {
  const token = jwt.sign({ userId: userId.toString() }, config.JWT_SECRET);
  await dbQuery(`insert into tokens (userId, token) values ('${userId}', '${token}')`);
  return token;
}

async function getUsers(req, res, next) {
  let { start = 0, limit = 10 } = req.body;
  if (limit <= 0) limit = 10;
  try {
    let users = await dbQuery('select * from users');
    const totalCount = users.length;

    users = users.slice(start, limit);
    let result = { results: users, totalCount, start, limit };
    res.send(result);
  }
  catch (e) {
    console.log('Error: ', e)
    res.status(400).send(e);
  }
}

async function addUser(req, res, next) {
  try {
    var user = req.body;
    let { email, password } = user;

    if (!email || !email.trim().length || !password || !password.trim()) {
      res.status(404).send({ error: 'email and password is required!' });
    } else {
      if (password.indexOf(' ') >= 0) {
        res.status(404).send({ error: 'password can not not have space!' });
      }
    }

    // Hash the plain text password
    password = await bcrypt.hash(user.password, 8);

    const addedUser = await dbQuery(`insert into users (email, password) values ('${email}', '${password}')`);

    if (addedUser && addedUser.insertId) {
      const { insertId } = addedUser;

      // Generate token
      const token = await generateAuthToken({ userId: insertId });
      res.send({ userId: insertId, email, token, userType: "service_consumer" });
    }
    else {
      console.log('Error: ------', addedUser)
      if (addedUser.code === 'ER_DUP_ENTRY') res.status(400).send({ error: 'Email is already registered.', code: 'ER_DUP_ENTRY' });
      res.status(400).send(addedUser)
    }
  }
  catch (e) {
    console.log('Error: ', e)
    res.status(400).send(e);
  }
}

async function getMyDetails(req, res) {
  const { password, ...rest } = req.user;
  res.send(rest);
}

async function logout(req, res) {
  const isLogout = await dbQuery(`delete from tokens where token='${req.token}'`);
  console.log('isLogout: ', isLogout)

  res.send()
  // res.send(req.user);
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Email and Password required for login!');
  }

  let user = await dbQuery(`select * from users where email='${email}'`);

  if (user && user.length) {
    user = user[0];
    console.log('login user: ', user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send({ error: 'Password is wrong.' });
    }
    const token = await generateAuthToken({ userId: user.userId });
    const {userId, email, userType} = user;
    res.send({userId, email, userType, token});
  } else {
    res.status(400).send({ error: 'Unable to login' });
  }


  // if(!user) {
  //   res.status(400).send('Unable to login');
  // }

  // const isMatch = await bcrypt.compare(password, user.password)

  // if(!isMatch) {
  // 	res.status(400).send('Unable to login');
  // }

}

module.exports = { getUsers, addUser, getMyDetails, logout, login };
