const {client} = require('./connection');
async function runQuery() {
    try {
        await client.query(`SELECT a.author_name,a2.author_name AS mentor_name FROM author a INNER JOIN author a2 ON a2.author_id=a.mentor`);
        await client.query(`SELECT A.*,RP.paper_title FROM author A LEFT JOIN papers_authors PA ON A.author_id=PA.author_id  LEFT JOIN research_papers RP ON PA.paper_id=RP.paper_id);`);
        await client.query(`SELECT RP.paper_title,COUNT(PA.author_id) FROM research_papers RP LEFT JOIN papers_authors PA ON RP.paper_id=PA.paper_id GROUP BY RP.paper_title`);
       await client.query(`SELECT COUNT(PA.paper_id) AS total_papers_by_female FROM author A JOIN papers_authors PA ON A.author_id = PA.author_id WHERE A.gender = 'F';`);
       await client.query(`SELECT A.university,AVG(A.h_index) AS avg_h_index FROM author A GROUP BY A.university;`);
       await client.query(`SELECT A.university,SUM(PA.paper_id) AS research_papers FROM author A JOIN papers_authors PA ON A.author_id=PA.author_id GROUP BY A.university
        `);
        



 
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}