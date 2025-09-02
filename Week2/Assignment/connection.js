const {Client}= require('pg');
    const client= new Client({
        user:'hyfuser',
        host:'localhost',
        database:'authoers',
        password:'hyfpassword',
        port:5432,
    });
    client.connect();
    module.exports=client;