# Dinner Club Database: NoSQL Conversion Exercise

This document outlines the conversion of a normalized SQL dinner club database into a document-based MongoDB database.  
It includes collections, embedding and normalization decisions, example queries, reasoning, assumptions, and a discussion on database choice.

---

## Collections

In MongoDB, collections replace multiple normalized SQL tables.  
The following table maps SQL tables to MongoDB collections or fields:

| SQL Table       | MongoDB Collection / Field       | Notes                                                                 |
|-----------------|----------------------------------|----------------------------------------------------------------------|
| `members`       | `members` (separate collection) | Stores global member info (e.g., name, contact details) for reuse across dinners. |
| `venues`        | Embedded in `dinners` as object | Each dinner has one venue; embedding simplifies queries.              |
| `dinners`       | `dinners` (main collection)     | Central collection for dinner events, containing most related data.   |
| `foods`         | Embedded in `dinners` array     | Menu items are specific to each dinner, not reused globally.          |
| `dinner_members`| Embedded in `dinners` array     | Lists attendees for each dinner, referencing member IDs.              |
| `dinner_foods`  | Not needed                      | Handled by embedding foods array in `dinners`.                        |

**Main Collection**: `dinners` – contains all dinner event details, with embedded venues, foods, and member references.  
**Separate Collection**: `members` – for managing member profiles independently.

---

## Example Dinner Document

```json
{
  "_id": "D00001003",
  "date": "2020-03-20",
  "venue": {
    "code": "B03",
    "description": "Goat Farm",
    "address": "123 Farm Lane, Countryside"
  },
  "members": [
    { "member_id": 1, "name": "Amit" },
    { "member_id": 4, "name": "Dan" },
    { "member_id": 6, "name": "Hema" }
  ],
  "foods": [
    { "code": "P1", "description": "Vegetarian Pie", "type": "Main" },
    { "code": "T1", "description": "Herbal Tea", "type": "Beverage" },
    { "code": "M1", "description": "Chocolate Mousse", "type": "Dessert" }
  ]
}
```
---
## Embedding vs. Normalizing Decisions

| Data           | Approach                 | Reason                                                                 |
|----------------|--------------------------|------------------------------------------------------------------------|
| Venue          | Embedded object          | Each dinner has one venue; embedding avoids joins and simplifies queries. |
| Foods          | Embedded array of objects| Menu items are unique to each dinner and always fetched together.       |
| Members        | Embedded array with IDs  | References member IDs to link to `members` collection; balances embedding and normalization. |
| Dinner_Members | Embedded array in dinners| Attendee list is specific to each dinner; embedding simplifies retrieval. |
| Dinner_Foods   | Not needed               | Food relationships are handled by embedding foods in dinners.          |

---

### Embedding Decisions

- **Venue and Foods**: Embedded because they are tightly coupled to a specific dinner event and are typically accessed together.  
- **Members**: Embedded as an array of objects with `member_id` and `name` for quick access within the dinner document, but normalized into a separate `members` collection for profile management.

---

### Normalization Decisions

- **Members**: Stored in a separate collection to allow independent updates (e.g., address changes) without modifying multiple dinner documents.  
- **Junction tables** (`dinner_members`, `dinner_foods`) are eliminated, as their relationships are handled by embedding arrays in the `dinners` collection.

---

## Assumptions

- Dinners are **read-heavy**, with queries fetching entire dinner details (venue, foods, attendees) in one go.  
- Venue and food data are unique to each dinner and do not require reuse across multiple dinners.  
- Member data (e.g., contact info) may need independent updates, justifying a separate `members` collection.  
- The system prioritizes **query simplicity and performance** over strict relational integrity.

---

## PostgreSQL vs. MongoDB

| Feature       | PostgreSQL (SQL)                | MongoDB (NoSQL)                       |
|---------------|---------------------------------|--------------------------------------|
| Schema        | Fixed, normalized tables        | Flexible, schema-less documents      |
| Relationships | Strong with foreign keys/joins  | Embedding or manual referencing      |
| Scaling       | Vertical scaling               | Horizontal scaling                    |
| Best For      | Complex relationships, data integrity | Flexible data, quick development |

---

## Choice

**MongoDB is preferred** for the dinner club database because:

- Dinner events are naturally document-like, with venues, foods, and attendees tightly coupled.  
- Flexible schema accommodates changes (e.g., adding new food types or event details).  
- Read-heavy queries benefit from embedding, reducing the need for joins.  
- JSON-like structure aligns with modern API designs for easy integration.  

**PostgreSQL would be better if**:

- Strict data integrity is critical (e.g., preventing duplicate members).  
- Complex relational queries are needed (e.g., analyzing attendance patterns).  
- Transaction-heavy operations are common (e.g., simultaneous updates across multiple tables).

---

## Discussion

### Embedding vs. Normalization

- **Embedding**: Venues, foods, and attendee lists are embedded in the `dinners` collection because they are specific to each dinner and typically accessed together. This optimizes read performance and eliminates the need for joins.  
- **Normalization**: Member data is normalized into a separate `members` collection to allow independent updates without duplicating info across dinners.  

### Omitted Tables

- Junction tables like `dinner_members` and `dinner_foods` are unnecessary in MongoDB, as relationships are managed through embedding arrays or referencing member IDs.
