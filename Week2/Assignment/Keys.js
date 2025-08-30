const {client}=require('./connection');
async function main(){
    try{
const creatTableAuthor = `
CREATE TABLE IF NOT EXISTS author(
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    university VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    h_index INT NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F', 'O'))
);`;

    const alterTableAuthor = `ALTER TABLE author ADD COLUMN mentor INT REFERENCES author(author_id);`;

    await client.query(creatTableAuthor);
    await client.query(alterTableAuthor);
    console.log('Table created and altered successfully');

    }catch(err){
        console.error('Connection error',err.stack);
    }
    finally{
        await client.end();
    }

}
main();