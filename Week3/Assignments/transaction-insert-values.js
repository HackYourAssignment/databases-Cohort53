const {client}=require('./connection.js');
async function insertValues(){
    try{
        const insertAccountQuery=`INSERT INTO account (account_number,balance) VALUES ($1,$2),($3,$4),($5,$6),($7,$8)
        ON CONFLICT (account_number) DO NOTHING;`;
        const values=[
            [101, 1000],
            [102, 2000],
            [103, 1500],
            [104, 3000]
        ];
        const res=await client.query(insertAccountQuery, values);
        console.log('Inserted account numbers:', res.rows);
        const insertAccountChangesQuery=`INSERT INTO account_changes (account_number, amount, remark) VALUES
        ($1,$2,$3),($4,$5,$6),($7,$8,$9),($10,$11,$12)
  `;
        const changesValues=[
            [101, 2000, 'Initial deposit'],
            [102, 500, 'Initial deposit'],
            [103, 1000, 'Initial deposit'],
            [104, 300, 'Initial deposit']
        ];

        await client.query(insertAccountChangesQuery, changesValues);
        console.log('Inserted values into account_changes table');
    }
    catch(err){
        console.error('Error inserting values', err.message);
    }finally{
        await client.end();
    }
}
insertValues();