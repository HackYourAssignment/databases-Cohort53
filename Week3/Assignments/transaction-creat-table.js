const{client}=require('./connection.js');

async function createTables(){
    try{
        await client.query('DROP TABLE IF EXISTS account_changes');
        await client.query('DROP TABLE IF EXISTS account');

        const createAccountTableQuery=`CREATE TABLE  account(
            account_number INT PRIMARY KEY,
            balance NUMERIC(12,2) NOT NULL);`;
            const creatAccount_changesTableQuery=`CREATE TABLE  account_changes(
            change_number SERIAL PRIMARY KEY,
            account_number INT ,
            AMOUNT NUMERIC(12,2) NOT NULL,
            changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            remark VARCHAR(255),
            FOREIGN KEY (account_number) REFERENCES account(account_number) ON DELETE CASCADE);`;
        await client.query(createAccountTableQuery);
        await client.query(creatAccount_changesTableQuery);
        console.log('Tables created successfully');
    

    }
    catch(err){
        console.error('Error creating tables', err.message);
    }finally{
        await client.end();
    }
}
createTables();