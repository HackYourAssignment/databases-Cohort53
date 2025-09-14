# Exercise 1: SQL Normalization

## 1. What columns violate 1NF?

- `food_code` and `food_description` violate **1NF** because they contain multiple values in a single cell (comma-separated lists).

## 2. What entities can be extracted?

- **Members** (member_id, member_name, member_address)
- **Dinners** (dinner_id, dinner_date, venue_code)
- **Venues** (venue_code, venue_description)
- **Foods** (food_code, food_description)
- **Dinner_Food** (relation between dinner and foods)
- **Dinner_Members** (relation between members and dinners)

## 3. Tables in 3NF

### Members

- member_id (PK)
- member_name
- member_address

### Venues

- venue_code (PK)
- venue_description

### Dinners

- dinner_id (PK)
- dinner_date
- venue_code (FK → Venues.venue_code)

### Foods

- food_code (PK)
- food_description

### Dinner_Foods

- dinner_id (FK → Dinners.dinner_id)
- food_code (FK → Foods.food_code)
- **Primary Key: (dinner_id, food_code)**

### Dinner_Members

- dinner_id (FK → Dinners.dinner_id)
- member_id (FK → Members.member_id)
- **Primary Key: (dinner_id, member_id)**
