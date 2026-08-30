# ADR-002: Database Strategy

## Status

Accepted

## Date

2026-08-30

---

# Context

Reflex Logistics requires persistent storage for business-critical information.

The platform will manage related data including:

- Users
- Tenants
- Customers
- Products
- Inventory
- Orders
- Deliveries
- Payments
- Audit records

The database must support:

- Strong data consistency
- Relationships between entities
- Transactional operations
- Data integrity
- Scalable querying
- Reliable migrations

The system also requires a clear source of truth for business data.

---

# Decision

Reflex will use PostgreSQL as the primary database.

PostgreSQL will act as the authoritative source for persistent business information.

The application will use Prisma as the database access layer.

The database architecture will prioritize:

- Relational data modelling
- Foreign key relationships
- Transaction support
- Constraints
- Indexed queries
- Controlled migrations

---

# Database Responsibilities

PostgreSQL will be responsible for storing:

- Tenant information
- User records
- Business entities
- Logistics workflows
- Transaction records
- Audit information

The database will remain the source of truth.

Other infrastructure components such as Redis must not replace PostgreSQL for persistent business data.

---

# Alternatives Considered

## MongoDB

Considered because:

- Flexible document structure
- Rapid schema changes
- Good support for document-based data

Rejected because:

- Logistics workflows contain many relationships
- Transaction consistency is important
- Relational constraints provide stronger integrity guarantees

---

## MySQL

Considered because:

- Mature relational database
- Widely adopted

Not selected because:

- PostgreSQL provides strong advanced relational features
- PostgreSQL has strong support for complex queries and extensions

---

## Database-per-Tenant

Considered for multi-tenancy.

Benefits:

- Strong tenant isolation
- Independent databases

Rejected initially because:

- Higher operational complexity
- More difficult migration management
- Increased infrastructure requirements

---

# Trade-offs

Benefits:

- Strong consistency
- Reliable transactions
- Clear relationships between entities
- Mature ecosystem
- Strong tooling support

Costs:

- Less flexible than document databases
- Requires careful schema design
- Schema changes require migrations

---

# Prisma Decision

Prisma is selected as the database access layer.

Benefits:

- Type-safe database access
- Migration support
- Developer productivity
- Clear schema management

Trade-offs:

- Adds an abstraction layer
- Requires Prisma-specific knowledge

---

# Migration Strategy

Database changes should be introduced through migrations.

Changes should:

- Be reviewed
- Be reversible where possible
- Avoid unnecessary destructive operations

Production database changes should never be performed manually without documentation.

---

# Consequences

All business-critical data will be designed around PostgreSQL.

Database design must consider:

- Tenant isolation
- Indexing
- Constraints
- Data lifecycle
- Performance requirements

Future database-related decisions should be documented through additional ADRs.