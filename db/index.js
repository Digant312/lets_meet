var mysql = require('mysql');

var dbConfig = {
    host: "localhost",
    user: "devuser",
    password: "hira@1CHAND",
    database: "lets_meet"
};

// var dbConfig = {
//     host: "remotemysql.com",
//     user: "1DrftEGDiy",
//     password: "rt6Wb8lD2O",
//     database: "1DrftEGDiy"
// };

class Database {
    constructor(dbConfig) {
        this.connection = mysql.createConnection(dbConfig);
    }
    query(sql, args) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if (err)
                    return reject(err);
                resolve(rows);
            } );
        } );
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const database = new Database(dbConfig);

const dbQuery = async (query) => {
    try{
        const result = await database.query(query);
        return result;
    } 
    catch(err) {
        console.log('Error: ', err);
        return err;
    }
};

module.exports = {dbQuery, database};