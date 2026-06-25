# Security policy

## Design intent
This project deliberately routes all database access through a server-side
Edge Function that verifies a LINE access token before reading follow status.
The `friend_status` table has RLS enabled with no anon/authenticated policies,
so it cannot be read from the browser. Do not add a client-readable policy to
that table unless you fully understand the implications.

## Reporting a vulnerability
Open a private GitHub security advisory. Please do not file public issues for
vulnerabilities.
