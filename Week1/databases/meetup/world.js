const { Client } = require('pg');
async function main(){
    const client=new Client({
        user:'hyfuser',
        host:'localhost',
        database:'world',
        password:'hyfpassword',
        port:'5432',
    });
    try{
        await client.connect();
        console.log("Connected successfully to the database");
        const selectNamesOfCountryQuery=`SELECT name FROM country WHERE population >8000000;`;
        const res=await client.query(selectNamesOfCountryQuery); 
        console.log(res.rows);
        const selectNamesOfCountrty=`SELECT name FROM country WHERE  name LIKE '%land%';`;
        const res1=await client.query(selectNamesOfCountrty);
        console.log(res1.rows);
        const selectNamesOfCity=`SELECT name FROM city WHERE population BETWEEN 500000 AND 1000000;`;
        const res2=await client.query(selectNamesOfCity);
        console.log(res2.rows);
        const selectCountriesOfContinent=`SELECT name FROM country WHERE continent='Europe';`;
        const res3=await client.query(selectCountriesOfContinent);
        console.log(res3.rows);
        const selectCountriesOrderBysurfaceArea=`SELECT * DROM country ORDER BY surfacearea DESC;`;
        const res4=await client.query(selectCountriesOrderBysurfaceArea);
        console.log(res4.rows);
        const selectcitiesNamesOfCountry=`SELECT name FROM city WHERE CountryCode='NLD';`;
        const res5=await client.query(selectcitiesNamesOfCountry);
        console.log(res5.rows);
        const selectPopulationOfCity=`SELECT Population FROM city WHERE Name='Roterdam';`;
        const res6=await client.query(selectPopulationOfCity);
        console.log(res6.rows);
        const selectTopCountriesbysurfaceArea=`SELECT Name,SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10;`;
        const res7=await client.query(selectTopCountriesbysurfaceArea);
        console.log(res7.rows);
        const selectTopPopulatedCities=`SELECT Name,Population FROM city ORDER BY Population DESC LIMIT 10;`;
        const res8=await client.query(selectTopPopulatedCities);
        console.log(res8.rows);
        const selectPopulationOfWorld=`SELECT SUM(Population) AS total_population FROM country;`;
        const res9=await client.query(selectPopulationOfWorld);
        console.log(res9.rows);


    
    }
    catch(err){
        console.error('Error executing query', err.stack);
    }

}