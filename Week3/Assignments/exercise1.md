# Database Normalization Answers

## 1. Columns that violate 1NF

The following columns violate 1NF because they contain multiple values in a single cell:
- `food_code` (e.g., `C1, C2`)
- `food_description` (e.g., `Curry, Cake`)

## 2. Recognized Entities

Entities that can be extracted:

1. **Member**
   - Columns: `member_id`, `member_name`, `member_address`
2. **Dinner**
   - Columns: `dinner_id`, `dinner_date`, `venue_code`
3. **Venue**
   - Columns: `venue_code`, `venue_description`
4. **Food**
   - Columns: `food_code`, `food_description`

**Relationships:**
- Many-to-many between Member and Dinner → junction table `Member_Dinner`
- Many-to-many between Dinner and Food → junction table `Dinner_Food`
- One-to-Many between dinner and venue

## 3. 3NF Compliant Tables and Columns

### Member
- `member_id` (PK)
- `member_name`
- `member_address`

### Venue
- `venue_code` (PK)
- `venue_description`

### Dinner
- `dinner_id` (PK)
- `dinner_date`
- `venue_code` (FK → Venue)

### Food
- `food_code` (PK)
- `food_description`

### Member_Dinner (junction table)
- `member_id` (FK → Member)
- `dinner_id` (FK → Dinner)
- PK = (`member_id`, `dinner_id`)

### Dinner_Food (junction table)
- `dinner_id` (FK → Dinner)
- `food_code` (FK → Food)
- PK = (`dinner_id`, `food_code`)
