# Frontend Modules Structure

This project now separates feature boundaries by domain so future development stays modular and easier to maintain.

## Domains

- `modules/public/` - user-facing experience (home, rooms, bookings, payment).
- `modules/admin/` - admin-facing experience (dashboard, inventory, bookings, permissions, ledger).

## How to use this structure

- Import public UI building blocks from `@/modules/public/...`.
- Import admin UI building blocks from `@/modules/admin/...`.
- Keep route files under `app/` thin. They should orchestrate data flow and call feature modules.
- When adding new shared logic, place it under the matching module first; only promote to global `components/` or `lib/` when truly cross-domain.

## Current migration status

- Route entry points already import from:
  - `@/modules/public/components/*`
  - `@/modules/admin/components/*`
- Legacy paths still exist for backward compatibility and can be migrated incrementally.
