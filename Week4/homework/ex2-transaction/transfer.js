const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'financeDB';
async function transferAmount(client, fromAccount, toAccount, amount, remark){
    const session = client.startSession();
    const transactionOptions={
        readPreference: {mode: 'primary'},
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try{
        await session.withTransaction(async()=>{
            const fromAcc=await client.db(dbName).collection('accounts').findOne({account_number:fromAccount},{session});
            const toAcc=await client.db(dbName).collection('accounts').findOne({account_number:toAccount},{session});
            if(!fromAcc || !toAcc){
                throw new Error(`Account not found`);
            }
            if(fromAcc.balance<amount){
                throw new Error(`Insufficient funds in account ${fromAccount}`);
            }
            const newFromBalance=parseInt(fromAcc.balance)-amount;
            const newToBalance=parseInt(toAcc.balance)+amount;
            await client.db(dbName).collection('accounts').updateOne({account_number:fromAccount},{$set:{balance:newFromBalance}},{session});
            await client.db(dbName).collection('accounts').updateOne({account_number:toAccount},{$set:{balance:newToBalance}},{session});
        }, transactionOptions);
        

}catch(err){
    console.log('Transaction aborted due to error:', err.message);
    await session.abortTransaction();
    session.endSession();
    return;
}finally{
    session.endSession();
}
}
