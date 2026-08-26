export const databaseKnowledge = `
Database: Shiftsdeal

Table: venues
Purpose: Stores venue information.

Important columns:
- id: uuid
- owner_id: uuid
- name: text
- description: text
- type: text

Table: bookings
Purpose: Stores venue bookings.

Table: users
Purpose: Stores users.

Relationships:
- venues.owner_id is related to a user/owner
- bookings are related to users and venues

Rules:
- Use PostgreSQL syntax.
- Only generate read-only SELECT queries.
- Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
`;