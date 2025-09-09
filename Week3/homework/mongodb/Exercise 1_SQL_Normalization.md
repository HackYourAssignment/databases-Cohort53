### 3.1. Exercise 1 : SQL Normalization

1. What columns violate 1NF?

1NF requires:

Each cell must contain a single atomic value (no lists, no repeating groups).

Data must be consistent in format.

- food_code → contains multiple values: "C1, C2", "P1, T1, M1".

- food_description → contains multiple values: "Curry, Cake", "Pie, Tea, Mousse".

- dinner_date → inconsistent formats (2020-03-15, 20-03-2020, and Mar 25 '20).

2. What entities do you recognize that could be extracted?

- Members, Dinners, Venues, Foods, Dinner Participation, Dinner Foods

3. Name all the tables and columns that would make a 3NF compliant solution.

1. Members

member_id

member_name

member_address

2. Venues

venue_code

venue_description

3. Dinners

dinner_id

dinner_date

venue_code

4. Foods

food_code

food_description

5. DinnerParticipation (as a junction table to connect members with dinners dinners)

member_id

dinner_id

6. DinnerFoods (as a junction table to connect foods with dinners)

dinner_id

food_code
