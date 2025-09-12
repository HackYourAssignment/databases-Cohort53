const {client}=require('./connection.js');
async function makeTransaction(){
    try{
        await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        const res=await client.query('select balance from account where account_number =$1',[101]);
        console.log('Current balance for account 101:', res.rows[0].balance);
        if(res.rows[0].balance<=1000){
            throw new Error('Insufficient funds in account 101');
        }
            await client.query('UPDATE account SET balance=balance - $1 WHERE account_number=$2',[1000,101]);
            await client.query('UPDATE account SET balance=balance + $1 WHERE account_number=$2',[1000,102]);
            await client.query('INSERT INTO account_changes (account_number,amount,remark) VALUES ($1,$2,$3)',[101,-1000,'Transfer to account 102']);
            await client.query('INSERT INTO account_changes(account_number,amount,remark) VALUES ($1,$2,$3)',[102,1000,'Transfer from account 101']);
            await client.query('COMMIT');
            console.log('Transaction completed successfully');
    }
    catch(err){
        await client.query('ROLLBACK');
        console.error('Error making transaction', err.message);
    }
    finally{
        await client.end();
    }
}