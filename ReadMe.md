
````markdown
# Wallet Project

This project runs using **Docker** and **Node.js**. Follow the steps below to set up and run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/farzadrastgar/wallet.git
cd wallet
````

## 2. Start Required Services

Run the following command to start the required services using Docker:

```bash
docker compose up -d
```

This will start all dependencies defined in the `docker-compose.yml` file.

## 3. Environment Variables

Create a `.env` file based on the example file:

```bash
cp env.example .env
```

Update the environment variables in `.env` if needed.

## 4. Install Dependencies

Install the Node.js dependencies:

```bash
npm install
```

## 5. Run the Development Server

Start the project in development mode:

```bash
npm run dev
```

The application should now be running locally.

## Requirements

* Node.js (recommended v18 or higher)
* Docker
* Docker Compose


## Database Schema

This project uses **PostgreSQL** (or any relational DB supported by TypeORM) with three main tables: `users`, `wallets`, and `transactions`.

### Users

Stores registered user information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| username | varchar(255) | Unique username |
| password | varchar(255) | Hashed password |
| email | varchar(255) | Optional email address |
| isVerified | boolean | Whether the user has verified their account |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Record last update time |

**Relationships:**
- One **User** has one **Wallet** (`1:1` relationship).

---

### Wallets

Represents the user’s wallet with balances in gold and EUR.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| goldBalance | decimal(18,6) | Gold balance in grams |
| fiatBalance | decimal(18,2) | Fiat balance in EUR |
| userId | UUID | Foreign key to `users.id` |

**Relationships:**
- One **Wallet** belongs to one **User** (`1:1` relationship).

---

### Transactions

Represents transactions (BUY/SELL) made by a user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to `users.id` |
| walletId | UUID | Foreign key to `wallets.id` |
| type | enum("BUY", "SELL") | Type of transaction |
| amountEUR | decimal(12,4) | Amount in EUR |
| goldAmount | decimal(12,4) | Gold amount in grams |
| goldPrice | decimal(12,4) | Price per gram in EUR |
| idempotencyKey | varchar | Optional key to prevent duplicate transactions |
| createdAt | timestamp | Transaction creation time |

**Relationships:**
- One **User** can have many **Transactions** (`1:N` relationship).
- One **Wallet** can have many **Transactions** (`1:N` relationship).



## Architecture Decisions

This project was designed with simplicity, scalability, and reliability in mind. Key decisions:

1. **Node.js + TypeScript**  
   - Provides type safety, better code maintainability, and modern JavaScript features.
   
2. **TypeORM**  
   - Object-relational mapper (ORM) for PostgreSQL.  
   - Simplifies database interactions and automatically handles migrations, relationships, and indexes.

3. **Database Choice**  
   - **PostgreSQL** recommended for ACID compliance and transactional safety.  
   - Decimal types are used for monetary values to avoid floating-point inaccuracies.

4. **Docker & Docker Compose**  
   - All services (DB, app) run in containers for reproducibility.  
   - `docker compose up -d` starts the full environment locally.


## How transactions remain consistent

1. ACID Transactions

Atomicity: All steps in a transaction succeed or fail together (e.g., deducting EUR and adding gold happens as one unit).

Consistency: Database always remains in a valid state (balances never negative).

Isolation: Concurrent transactions don’t interfere with each other.

Durability: Once committed, changes are permanent even if the system crashes.

2. Locking Mechanism

Row-level locks (SELECT ... FOR UPDATE) prevent concurrent transactions from modifying the same wallet simultaneously.

Ensures that two simultaneous buys or sells cannot corrupt balances.

Optimistic locks can be used for higher concurrency by checking a version number before committing updates.

3. Idempotency

Each transaction can have a unique idempotencyKey.

If the same request is retried (e.g., network failure), the system prevents duplicate execution.

Protects against double spending and ensures financial integrity.

## How this system could scale to millions of users

1. Database Layer

## PostgreSQL (recommended) can handle millions of users if scaled properly:

- Vertical Scaling (Initial phase)

- Use a powerful DB server with enough CPU, RAM, and SSD storage.

- Add proper indexes on userId, walletId, createdAt for fast lookups.

- Use partitioning for transactions table (e.g., by date or user region) to reduce table size per query.

## Horizontal Scaling (Advanced phase)

- Read Replicas: For read-heavy operations (e.g., fetching transaction history).

- Sharding: Split users or wallets across multiple DB instances by userId hash.

- Keep writes to the same shard to avoid cross-node transactions, which are expensive.

## Connection Pooling

Use PgBouncer or TypeORM pooling to efficiently handle thousands of concurrent DB connections.

2. Application Layer

## Stateless API Servers

- Each Node.js server handles requests independently.

- Store session/state in Redis or JWTs.

- Can horizontally scale behind a load balancer.

## Transaction Handling

- Keep transaction logic inside ACID DB transactions.

- Use row-level locks to prevent race conditions while updating balances.

- Use idempotency keys to safely handle retries at scale.

## Queue for High-Volume Operations

- For very high throughput, offload non-critical processing (like notifications or analytics) to a message queue (Kafka, RabbitMQ).

- This prevents API servers from blocking on heavy operations.

3. Caching Layer

- Use Redis to cache frequently accessed data, e.g.,:

- User profiles

- Wallet balances (with caution; always verify with DB for writes)

- Reduces DB load for read-heavy workloads.

4. Sharding & Multi-Tenancy Considerations

Sharding by userId:

- Each shard handles a subset of users.

- Transactions for a user always hit the same shard.

Partitioning transactions:

- Large transactions table can be split by month or region.

- Improves query performance for analytics and reporting.


5. Optional Optimizations for Millions of Users

Batch Writes: Aggregate non-critical updates to reduce write contention.

Event Sourcing: Record all operations in an append-only log (e.g., Kafka) for auditability and replay.

CQRS (Command Query Responsibility Segregation):

- Commands (writes) go to primary DB.

- Queries (reads) go to replicated or read-optimized DBs.


## Improvements you would implement in production

Scalability Improvements

- Horizontal Scaling: Use load balancers with multiple API server instances.

- Database Scaling: Use a combination of read replicas, sharding, and partitioning.

- Async Processing: Use queues for email, notifications, and other non-critical tasks.

Testing & Reliability

- Unit and End-to-End Testing: Simulate high concurrency with multiple wallets and transactions.

Logging & tracing

- Metrics & Logging: Collect API metrics, transaction times, error rates. Tools: Prometheus, Grafana, ELK stack.

- Tracing: Use OpenTelemetry for tracing multi-service operations.


Application Architecture

- Stateless Microservices: Separate user management, wallet operations, and transactions into independent services.

- Queue-Based Processing: Offload heavy operations to Kafka or RabbitMQ.

- Circuit Breakers & Rate Limiting: Protect the system from sudden spikes in requests or downstream failures.

