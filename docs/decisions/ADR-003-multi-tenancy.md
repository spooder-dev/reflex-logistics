# ADR-003: Multi-Tenancy Strategy

## Status

Accepted

## Date

2026-08-30

---

# Context

Reflex Logistics is designed as a multi-tenant platform.

Multiple organizations may use the same system while requiring strict separation of their data.

The system must ensure that:

- Users only access resources belonging to their tenant
- Business data cannot leak between organizations
- Tenant boundaries are enforced consistently
- The architecture remains maintainable as the platform grows

A tenant boundary is a security requirement, not only a data organization strategy.

---

# Decision

Reflex will initially use a shared database with shared schema multi-tenancy.

Tenant-owned records will contain a tenant identifier:
tenant_id


The backend will enforce tenant isolation on every tenant-scoped operation.

The tenant context will be derived from the authenticated user/session.

Clients will not be trusted to provide or modify tenant ownership information.

---

# Tenant Isolation Approach

The expected data access pattern is:
Authenticated User

    ↓

Determine Tenant Context

    ↓

Authorize Operation

    ↓

Query Resource Within Tenant Scope

    ↓

Return Result


Example:

Unsafe:

```typescript
findOrder(orderId)

because it does not verify ownership.

Preferred:

findOrder({
    id: orderId,
    tenantId: currentTenant.id
})

Database Considerations

Tenant-owned tables should include:

tenant_id

where applicable.

Examples:

Users
Customers
Orders
Deliveries
Products
Inventory records

Database indexes should consider tenant-scoped queries.

Example:

(tenant_id, id)
Alternatives Considered
Database-per-Tenant,

Each tenant receives a separate database.

Advantages:

Strong isolation
Independent scaling
Easier tenant-level backups

Rejected initially because:

Higher operational complexity
More difficult migrations
Increased infrastructure management
Schema-per-Tenant

Each tenant receives a separate database schema.

Advantages:

Stronger separation than shared schema
Better logical isolation

Rejected initially because:

Increased migration complexity
More difficult operational management
More complex tooling requirements
Shared Database / Shared Schema Without Tenant Isolation

Rejected.

Reason:

This creates a significant security risk because tenant data could accidentally become accessible across organizations.

Trade-offs

Benefits:

Simpler deployment model
Easier migrations
Lower infrastructure complexity
Efficient resource usage

Costs:

Requires strict application-level enforcement
Queries must always consider tenant scope
Incorrect implementation could expose data
Security Requirements

The implementation must enforce:

Tenant Context Validation

Tenant identity must come from trusted authentication context.

Query Isolation

All tenant-owned queries must include tenant scope.

Authorization Checks

A valid tenant relationship must exist before accessing resources.

Testing

The system must test:

User A from Tenant A

attempts to access

Tenant B resource

Expected result:

Access denied
PostgreSQL Row-Level Security Consideration

PostgreSQL Row-Level Security (RLS) may be considered as an additional protection layer.

Potential benefit:

Database-level enforcement of tenant boundaries

Potential cost:

Increased complexity
Additional database configuration

A future ADR may decide whether RLS should be implemented.

Consequences

All future features must consider tenant ownership.

Developers must avoid creating tenant-scoped resources without proper isolation.

Tenant isolation must be reviewed during:

Database design
API implementation
Authorization design
Testing
Future Review

This decision should be revisited if:

Tenant scale increases significantly
Enterprise isolation requirements change
Regulatory requirements demand stronger separation