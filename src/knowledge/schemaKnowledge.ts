export const schemaKnowledge = `
DATABASE: Shiftsdeal

====================
TABLE: api_usage
====================

Columns:
- id: uuid
- api_name: text
- usage_count: integer
- usage_limit: integer
- reset_date: timestamptz
- created_at: timestamptz
- updated_at: timestamptz


====================
TABLE: bookings
====================

Columns:
- id: uuid
- venue_id: uuid
- renter_id: uuid nullable
- event_name: text
- event_type: text
- event_description: text nullable
- date: date
- start_time: time
- end_time: time
- attendees: integer
- organization_name: text
- contact_name: text
- contact_email: text
- contact_phone: text
- special_requirements: text nullable
- kyc_document_type: text
- kyc_document_url: text
- kyc_face_photo_url: text
- contract_data: jsonb nullable
- signature: text

Pricing:
- base_price: numeric nullable
- platform_fee: numeric nullable
- subtotal: numeric nullable
- gst_amount: numeric nullable
- total_amount: numeric
- deposit_amount: numeric
- balance_amount: numeric

Booking/payment status:
- status: text
- payment_status: text
- deposit_paid: boolean
- deposit_paid_at: timestamptz nullable
- balance_paid: boolean
- balance_paid_at: timestamptz nullable
- payment_inprogress: boolean
- payment_method: text

Razorpay/payment fields:
- razorpay_payment_id: text nullable
- razorpay_order_id: text nullable
- razorpay_invoice_id: text nullable
- razorpay_invoice_status: text nullable
- razorpay_invoice_url: text nullable

Bank/payout fields:
- upi_id: text nullable
- bank_account_name: text nullable
- bank_name: text nullable
- bank_account_number: text nullable
- bank_ifsc: text nullable
- razorpay_payout_id: text nullable
- payout_status: text nullable
- payout_processed_at: timestamptz nullable

Other:
- follow_up_sent: boolean
- follow_up_sent_at: timestamptz nullable
- admin_notes: text nullable
- owner_commission_email_sent: boolean
- approved_at: timestamptz nullable
- created_at: timestamptz
- updated_at: timestamptz


====================
TABLE: users
====================

Columns:
- id: uuid
- email: text
- name: text
- role: text
- created_at: timestamptz
- updated_at: timestamptz
- payment_method: text nullable
- upi_id: text nullable
- bank_account_name: text nullable
- bank_account_number: text nullable
- bank_ifsc: text nullable
- payment_contact_email: text nullable


====================
TABLE: venue_ownerships
====================

Columns:
- id: uuid
- venue_id: uuid
- owner_email: text
- owner_user_id: uuid nullable
- owner_full_name: text nullable
- owner_phone: text nullable
- alternate_phone: text nullable
- business_name: text nullable
- organization_type: text nullable
- pan_gst: text nullable
- internal_notes: text nullable
- is_primary: boolean
- is_active: boolean
- created_at: timestamptz
- updated_at: timestamptz


====================
TABLE: venue_requests
====================

Columns:
- id: uuid
- owner_id: uuid
- name: text
- type: text
- description: text
- capacity_min: integer
- capacity_max: integer

Address:
- address_street: text
- address_city: text
- address_state: text
- address_pincode: text
- address_country: text

Media:
- images: text[]

Pricing:
- pricing_hourly: numeric
- pricing_half_day: numeric nullable
- pricing_full_day: numeric nullable
- security_deposit: numeric nullable
- commission_percentage: numeric

Other:
- amenities: text[]
- rules: text[]
- status: text
- admin_notes: text nullable
- reviewed_by: uuid nullable
- reviewed_at: timestamptz nullable
- rejection_reason: text nullable
- created_at: timestamptz
- updated_at: timestamptz


====================
TABLE: venues
====================

Columns:
- id: uuid
- owner_id: uuid nullable
- name: text
- description: text
- type: text

Media:
- images: text[]
- videos: text[]

Address:
- address_street: text
- address_city: text
- address_state: text
- address_pincode: text
- address_country: text
- google_maps_link: text nullable

Capacity:
- capacity_min: integer
- capacity_max: integer

Pricing:
- pricing_hourly: numeric
- pricing_half_day: numeric nullable
- pricing_full_day: numeric nullable
- pricing_per_slot: numeric nullable
- commission_percentage: numeric

Availability:
- availability: text
- min_booking_hours: integer nullable
- available_timings: text nullable
- booking_slots: text nullable
- blocked_dates: text[]

Other:
- amenities: text[]
- rating: numeric
- reviews_count: integer
- rules_restrictions: text nullable
- cancellation_policy: text nullable
- inventory_visibility: text
- gst_number: text nullable
- is_disabled: boolean
- is_archived: boolean
- created_at: timestamptz
- updated_at: timestamptz


IMPORTANT SCHEMA RULES

- Use only the tables and columns listed above.
- Never invent columns.
- UUID fields must be treated as UUID values.
- PostgreSQL COUNT() may return numeric values as strings in Node.js.
- Use PostgreSQL syntax only.
`;