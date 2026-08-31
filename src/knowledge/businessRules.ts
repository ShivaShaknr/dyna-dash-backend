export const businessRules = `
BUSINESS RULES

====================
BOOKINGS
====================

Total Bookings:
- Total bookings = COUNT(bookings.id)

Confirmed/Approved Bookings:
- Use bookings.status when the business question is specifically about booking status.
- Do not infer booking approval from payment status.

Booking Date:
- Use bookings.date for the actual event/booking date.
- Use bookings.created_at only when the user asks when the booking record was created.

====================
PAYMENTS
====================

IMPORTANT PAYMENT RULE:
- For payment-related questions, use only:
  - bookings.total_amount
  - bookings.payment_status
- Do not use:
  - bookings.deposit_amount
  - bookings.balance_amount
  - bookings.deposit_paid
  - bookings.balance_paid
  - bookings.deposit_paid_at
  - bookings.balance_paid_at
- Do not calculate pending balance, paid balance, deposit amount, or remaining amount.

Total Booking Amount:
- Total booking amount = SUM(bookings.total_amount)

Fully Paid Bookings:
- Use bookings.payment_status = 'fully_paid'

Pending Payments:
- Use bookings.payment_status = 'pending'

Expired Payments:
- Use bookings.payment_status = 'expired'

Payment Status Comparison:
- Group using bookings.payment_status
- Count bookings using COUNT(bookings.id)
- When amount comparison is requested, use SUM(bookings.total_amount)

====================
REVENUE
====================

Revenue:
- Revenue = SUM(bookings.total_amount)
- Include only bookings where bookings.payment_status = 'fully_paid'
- Do not include pending or expired bookings unless the user explicitly asks for them

Average Booking Value:
- Average booking value = AVG(bookings.total_amount)
- Use fully paid bookings unless the user explicitly asks for all bookings

Pending Payment Amount:
- Pending payment amount = SUM(bookings.total_amount)
- Filter using bookings.payment_status = 'pending'

Expired Booking Amount:
- Expired booking amount = SUM(bookings.total_amount)
- Filter using bookings.payment_status = 'expired'

====================
VENUES
====================

Total Venues:
- Total venues = COUNT(venues.id)

Active Venues:
- Active venues should exclude:
  venues.is_disabled = true
  venues.is_archived = true

Available Venues:
- Use venues.availability = 'available'
- Also exclude disabled and archived venues unless the user explicitly asks for all records

Venue Rating:
- Use venues.rating

Venue Reviews:
- Use venues.reviews_count

Venue Capacity:
- Minimum capacity = venues.capacity_min
- Maximum capacity = venues.capacity_max

Venue Pricing:
- Hourly price = venues.pricing_hourly
- Half-day price = venues.pricing_half_day
- Full-day price = venues.pricing_full_day
- Slot price = venues.pricing_per_slot

====================
COMMISSION
====================

Venue Commission Percentage:
- Use venues.commission_percentage for approved/existing venues

Venue Request Commission Percentage:
- Use venue_requests.commission_percentage for pending/requested venues

Estimated Commission Amount:
- If asked for commission amount:
  commission amount = bookings.total_amount * venues.commission_percentage / 100
- Join bookings.venue_id = venues.id
- Clearly treat this as a calculated value

====================
USERS
====================

Renters:
- bookings.renter_id joins users.id

Venue Owners:
- venues.owner_id joins users.id

User Role:
- Use users.role

====================
COMPARISONS
====================

For comparison/ranking queries:
- Sort by the requested metric descending unless the user asks otherwise
- Return the top 10 by default
- Use fewer rows if the user asks for top 5, top 3, etc.

For payment comparisons:
- Use bookings.payment_status as the category
- Use COUNT(bookings.id) when comparing number of bookings
- Use SUM(bookings.total_amount) when comparing payment amounts

For time trends:
- Prefer bookings.date for booking/event trends
- Group appropriately by day, month, quarter, or year based on the question

====================
IMPORTANT RULES
====================

- Never invent business rules.
- Never invent status values.
- Never invent monetary columns.
- For payment-related answers, rely only on bookings.total_amount and bookings.payment_status.
- Ignore deposit and balance related fields for payment analytics.
- Use the schema and relationships provided in knowledge.
- If a requested metric does not have a defined business rule, use the most direct database meaning and avoid assumptions.
- For actual commission or commission earned, use only bookings.platform_fee from fully_paid bookings.
- Do not include platform_fee from pending or expired bookings in earned commission.
- Prefer bookings.platform_fee over calculating commission from venues.commission_percentage when asking for actual commission earned.
====================
DATE FILTERING
====================

Specific Date:
- When the user asks for a specific booking/event date, filter using bookings.date.
- Example:
  "sales on 20 August 2026"
  means bookings.date = '2026-08-20'
- Do not use bookings.created_at for a specific sales/booking date unless the user explicitly asks for records created on that date.

Specific Date Revenue / Sales:
- Sales/revenue for a specific date =
  SUM(bookings.total_amount)
- Filter:
  bookings.date = requested_date
  AND bookings.payment_status = 'fully_paid'

Date Range:
- When the user gives a start date and end date, use:
  bookings.date >= start_date
  AND bookings.date <= end_date

Today:
- "today" means the current calendar date.
- Filter using bookings.date = current_date.

Yesterday:
- "yesterday" means current_date - 1 day.

This Week:
- Use bookings.date from the start of the current week through the end of the current week.

Last Week:
- Use the complete previous calendar week.

This Month:
- Use bookings.date within the current calendar month.

IMPORTANT:
- Do not use DATE(bookings.created_at) when the user asks about booking sales, event sales, or revenue for a specific event date.
- Use bookings.created_at only for questions such as:
  "bookings created on..."
  "records created yesterday"
  "new bookings added this week"
====================
COMMISSION
====================

Commission Earned:
- When the user asks for:
  - commission
  - commission earned
  - total commission
  - platform commission
  - commission revenue
  use bookings.platform_fee.

- Commission earned =
  SUM(bookings.platform_fee)

- Include only bookings where:
  bookings.payment_status = 'fully_paid'
  AND bookings.status = 'completed'

- Do not include bookings where:
  bookings.payment_status = 'pending'
  bookings.payment_status = 'expired'

- Do not include bookings with status other than 'completed'.

- Do not sum platform_fee from all bookings unless the user explicitly asks for platform fees across all booking/payment statuses.

Commission by Date:
- When commission is requested for a specific booking/event date:
  SUM(bookings.platform_fee)

- Filter using:
  bookings.date = requested_date
  AND bookings.payment_status = 'fully_paid'
  AND bookings.status = 'completed'

Commission by Date Range:
- Use:
  SUM(bookings.platform_fee)

- Filter using:
  bookings.date >= start_date
  AND bookings.date <= end_date
  AND bookings.payment_status = 'fully_paid'
  AND bookings.status = 'completed'

Commission Comparison:
- For commission comparisons by venue, date, month, owner, or another category:
  use SUM(bookings.platform_fee)

- Always filter:
  bookings.payment_status = 'fully_paid'
  AND bookings.status = 'completed'

Venue Commission Percentage:
- Use venues.commission_percentage for approved/existing venues.

Venue Request Commission Percentage:
- Use venue_requests.commission_percentage for pending/requested venues.

Estimated Commission Amount:
- Only when the user explicitly asks for estimated or calculated commission based on commission percentage:
  commission amount =
  bookings.total_amount * venues.commission_percentage / 100

- Join:
  bookings.venue_id = venues.id

- Clearly treat this as an estimated/calculated value.

- Do not use this formula when bookings.platform_fee represents the actual commission earned.

`