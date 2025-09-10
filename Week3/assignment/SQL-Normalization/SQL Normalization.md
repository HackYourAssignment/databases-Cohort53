
# Exercise 1: SQL Normalization

## 1️ What columns violate 1NF?

- **`food_code`** → contains multiple values in one cell (like `C1, C2`).  
- **`food_description`** → contains multiple values in one cell (like `Curry, Cake`).  

> These columns break 1NF because each cell should store only **one atomic value**.

---

## 2️ What entities can be extracted?

From the original table, we can identify the following entities:

1. **Member**  
   - `member_id`, `member_name`, `member_address`  

2. **Dinner**  
   - `dinner_id`, `dinner_date`, `venue_code`  

3. **Venue**  
   - `venue_code`, `venue_description`  

4. **Food**  
   - `food_code`, `food_description`  

5. **Dinner_Member** (linking table)  
   - Links members to dinners  

6. **Dinner_Food** (linking table)  
   - Links dinners to foods  

---

## 3️ Tables and columns for a 3NF compliant solution

### Members
```sql
member_id, member_name, member_address
