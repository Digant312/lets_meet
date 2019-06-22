const jwt = require('jsonwebtoken');
const config = require('@config').module;
const { dbQuery } = require('@db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const isMatch = await dbQuery(`select * from tokens where userId='${decoded.userId}' and token='${token}'`);

    if(isMatch && isMatch[0].userId && isMatch[0].userId == decoded.userId) {
      const user = await dbQuery(`select * from users where userId=${decoded.userId}`);
      if (!user) {
        throw new Error();
      }  
      req.token = token;
      req.user = user[0];
      next();
    } else {
      res.status(401).send({ error: 'Please authenticate.' });
    }    
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
}

module.exports = auth;