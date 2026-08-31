export const relationshipKnowledge = `
DATABASE RELATIONSHIPS

bookings.renter_id -> users.id
bookings.venue_id -> venues.id

venue_ownerships.owner_user_id -> users.id
venue_ownerships.venue_id -> venues.id

venue_requests.owner_id -> users.id
venue_requests.reviewed_by -> users.id

venues.owner_id -> users.id

JOIN RULES

- To get booking renter details:
  bookings.renter_id = users.id

- To get booking venue details:
  bookings.venue_id = venues.id

- To get venue owner details:
  venues.owner_id = users.id

- To get venue ownership records:
  venue_ownerships.venue_id = venues.id

- Never invent join columns.
- Only use the relationships defined above.
`;