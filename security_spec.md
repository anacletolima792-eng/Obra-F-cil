# Security Specification: Obra Fácil

## Data Invariants
1. A user can only access, create, modify, and delete their own expenses under `/users/{userId}/expenses/{expenseId}`.
2. The `userId` field inside the expense document must strictly equal `request.auth.uid`.
3. Expense amounts must be a positive number greater than 0.
4. Category must be strictly either `'material'` or `'mao_de_obra'`.
5. Description must be a non-empty string with maximum length of 300 characters.
6. The `createdAt` field is immutable on updates.
7. Unauthenticated requests are completely rejected (default deny).
8. Path variable `{userId}` must strictly match `request.auth.uid`.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Read**: Attempting to read `/users/user123/expenses/exp1` without auth -> PERMISSION_DENIED.
2. **Cross-User Snooping**: User A authenticated attempting to read `/users/userB/expenses/exp1` -> PERMISSION_DENIED.
3. **Identity Spoofing on Create**: User A attempting to write an expense with `userId: "userB"` -> PERMISSION_DENIED.
4. **ID Poisoning Attack**: Writing an expense with document ID containing 200 junk characters -> PERMISSION_DENIED.
5. **Negative Amount Exploit**: Writing an expense with `amount: -500.00` -> PERMISSION_DENIED.
6. **Zero Amount Exploit**: Writing an expense with `amount: 0` -> PERMISSION_DENIED.
7. **Invalid Category Injection**: Writing an expense with `category: "crypto"` -> PERMISSION_DENIED.
8. **Oversized Description Attack**: Writing an expense with 5,000 characters in description -> PERMISSION_DENIED.
9. **Ghost Field Injection (Shadow Update)**: Attempting to update with unauthorized field `isAdmin: true` -> PERMISSION_DENIED.
10. **Immutability Breach**: Updating `userId` or `createdAt` to arbitrary timestamps or new user ID -> PERMISSION_DENIED.
11. **Blanket Query Scraping**: Attempting to query `/users` or arbitrary subcollections without parent user scoping -> PERMISSION_DENIED.
12. **Malformed Types**: Writing `amount: "duzentos"` or `description: 12345` -> PERMISSION_DENIED.
