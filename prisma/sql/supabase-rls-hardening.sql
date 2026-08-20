alter table "Family" enable row level security;
alter table "Guardian" enable row level security;
alter table "Child" enable row level security;
alter table "ChildInterest" enable row level security;
alter table "EmergencyContact" enable row level security;
alter table "AuthorizedPickup" enable row level security;
alter table "RSVP" enable row level security;

revoke all on table "Family" from anon, authenticated;
revoke all on table "Guardian" from anon, authenticated;
revoke all on table "Child" from anon, authenticated;
revoke all on table "ChildInterest" from anon, authenticated;
revoke all on table "EmergencyContact" from anon, authenticated;
revoke all on table "AuthorizedPickup" from anon, authenticated;
revoke all on table "RSVP" from anon, authenticated;
