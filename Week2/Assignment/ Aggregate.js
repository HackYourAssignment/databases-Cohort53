const {client} = require('./connection');
async function runQuery() {
try{
    await client.query(`SELECT RP.paper_title,COUNT(PA.author_id) FROM research_papers RP LEFT JOIN papers_authors PA ON RP.paper_id=PA.paper_id GROUP BY RP.paper_title`);
    await client.query(`SELECT COUNT(PA.paper_id) AS total_papers_by_female FROM author A JOIN papers_authors PA ON A.author_id = PA.author_id WHERE A.gender = 'F';`);
    await client.query(`SELECT A.university,AVG(A.h_index) AS avg_h_index FROM author A GROUP BY A.university;`);
    await client.query(`SELECT A.university,COUNT(PA.paper_id) AS research_papers FROM author A JOIN papers_authors PA ON A.author_id=PA.author_id GROUP BY A.university`);
    await client.query(`SELECT A.university,MIN(A.h_index) AS min_h_index,MAX(A.h_index) AS max_h_index FROM author A GROUP BY A.university`);


}
catch(err){
    console.error('Error executing query', err.stack);
} finally {
    await client.end();
}
}
runQuery();