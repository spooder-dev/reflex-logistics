# ADR-005: Messaging and Caching Strategy

## Status

Accepted

## Date

2026-08-30

---

# Context

Reflex Logistics will require operations that should not block user requests.

Examples include:

- Notifications
- Background processing
- External service communication
- Long-running operations
- Event-driven workflows

The system also requires performance improvements for frequently accessed data.

However:

- Business data must remain consistent
- Infrastructure failures must not corrupt data
- Cached data must not become the source of truth

A clear strategy is required for asynchronous processing and caching.

---

# Decision

Reflex will use:

- RabbitMQ for asynchronous message processing
- Redis for caching and temporary application state

PostgreSQL remains the authoritative source for persistent business information.

The system will separate:

## Business State

Stored in:
PostgreSQL


Responsible for:

- Orders
- Deliveries
- Users
- Inventory
- Payments
- Other persistent records

---

## Temporary or Performance Data

Stored in:
Redis


Responsible for:

- Cache entries
- Temporary state
- Rate limiting data
- Short-lived coordination data

---

## Asynchronous Processing

Handled through:
Application

↓

Message Publisher

↓

RabbitMQ Exchange

↓

Queue

↓

Consumer Worker

↓

Handler

↓

Database / External Service


---

# RabbitMQ Strategy

RabbitMQ will be used for operations that do not need immediate completion within the request cycle.

Examples:

- Sending notifications
- Processing background jobs
- External integration workflows

---

# Message Processing Requirements

Consumers should support:

- Message acknowledgement
- Retry handling
- Failure handling
- Duplicate message handling
- Dead-letter processing

The system must not assume:
Message received = Message completed successfully


---

# Message Delivery Semantics

The system will primarily design around:

## At-least-once delivery

Reason:

Messages should not be silently lost.

Trade-off:

Consumers must handle possible duplicate processing.

---

# Idempotent Consumers

Because duplicate messages are possible, consumers must be designed to safely process repeated messages.

Examples:
Message received

↓

Check if operation already completed

↓

Already processed?

Yes → Return safely

No → Continue processing


---

# Redis Strategy

Redis will be used as a performance optimization layer.

Possible uses:

- Frequently accessed data caching
- Rate limiting
- Temporary state
- Distributed coordination

Redis will not store authoritative business information.

---

# Cache Design Requirements

Every cache entry should define:

- Key format
- Expiration time (TTL)
- Invalidation strategy
- Fallback behaviour

Example:
PostgreSQL

↓

Source of truth

Redis

↓

Temporary performance layer


---

# Alternatives Considered

## Synchronous Processing Only

Rejected because:

- Long-running operations would block requests
- Poor scalability for background workflows

---

## Kafka

Considered as a messaging platform.

Rejected initially because:

- Higher operational complexity
- Current requirements do not require large-scale event streaming

May be reconsidered in the future.

---

## Redis as a Message Queue

Rejected as the primary messaging solution because:

- RabbitMQ provides clearer message semantics
- Queue durability and acknowledgement features better match requirements

---

## Redis as Primary Storage

Rejected because:

- Data persistence guarantees are insufficient for business records
- Cache invalidation and consistency risks

---

# Trade-offs

## RabbitMQ Benefits

- Reliable message delivery
- Queue management
- Retry support
- Suitable for background processing

Costs:

- Additional infrastructure component
- Requires monitoring and maintenance

---

## Redis Benefits

- Fast access
- Useful performance improvements
- Supports temporary application state

Costs:

- Cache consistency complexity
- Requires invalidation strategies

---

# Failure Considerations

## RabbitMQ Failure

The system should:

- Detect unavailable messaging services
- Retry or delay processing
- Avoid losing critical operations

---

## Redis Failure

The system should:

- Continue operating where possible
- Fall back to PostgreSQL
- Avoid losing business data

---

## Worker Failure

The system should:

- Retry failed jobs where appropriate
- Preserve failed messages
- Provide useful logs

---

# Security Considerations

Messaging and caching systems must protect:

- Sensitive information
- Authentication data
- Personal data

Secrets and credentials must never appear in:

- Messages
- Logs
- Cache values

unless explicitly required and protected.

---

# Consequences

Future implementation must:

- Use RabbitMQ for asynchronous workflows
- Design idempotent consumers
- Treat PostgreSQL as the source of truth
- Treat Redis as an optimization layer

Infrastructure decisions should follow this architecture.

---

# Future Review

This decision should be revisited if:

- Event volume significantly increases
- Real-time streaming becomes necessary
- Infrastructure requirements change