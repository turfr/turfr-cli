# Turfr CLI

The Turfr CLI is the operator-facing interface for interacting with Turfr from the command line.

## Architecture Role

The CLI does not directly write to the database.

Its role is to:

1. Accept commands and input from the operator.
2. Interact with the user when clarification is required.
3. Communicate with `turfr-ingest` when ingestion is required.
4. Communicate with `turfr-api`.
5. Display the result of the operation.

The high-level model is:

```text
Human / Operator
        │
        ▼
    turfr CLI
        │
        ├── Interactive orchestration
        │
        ├── turfr-ingest
        │       │
        │       └── Understands human match data
        │
        ▼
    turfr-api
        │
        ▼
    Database
```

A useful responsibility model is:

```text
turfr-ingest → Understand
turfr-cli    → Resolve and orchestrate
turfr-api    → Authorize and persist
Database     → Remember
```

---

# Command Format

All commands follow the general format:

```bash
turfr <resource> <action> [arguments]
```

For example:

```bash
turfr player add
```

---

# Player Commands

## Add a Player

Create a new Turfr player.

### Interactive Mode

```bash
turfr player add
```

The CLI collects the required information interactively.

Conceptually:

```text
Player name:
> Swar

WhatsApp number:
> +91XXXXXXXXXX

Create player with these details?

Name: Swar
WhatsApp: +91XXXXXXXXXX

Confirm? (y/n)
```

After confirmation, the CLI sends the player creation request to `turfr-api`.

---

## Add a Player with Arguments

When supported arguments are provided, the CLI can avoid prompting for information already supplied.

```bash
turfr player add <name> <phone>
```

Example:

```bash
turfr player add "Swar" "+91XXXXXXXXXX"
```

The CLI should still display the collected information and request confirmation before creating the player.

---

# Why Players Should Be Created Before Historical Ingestion

Creating a few regular players before historical match ingestion gives the identity-resolution system existing records to work with.

For example:

```text
Historical Match
        │
        ▼
Participant: Swar
        │
        ▼
CLI searches existing players
        │
        ▼
Existing Player Found
        │
        ▼
Use existing Player ID
```

This means subsequent historical records do not need to recreate the same person.

---

# Identity Resolution

Names in historical match records are not considered unique identities.

For example, Turfr may contain multiple players with the same name:

```text
Multiple possible players found for "Abhilash Nair":

[1] Abhilash Nair — +91XXXXXXXXXX
[2] Abhilash Nair — +91XXXXXXXXXX
[3] Create new player
```

The operator explicitly selects the correct player.

The CLI then uses the selected player's internal identifier when constructing the final ingestion request.

The core principle is:

> Names are lookup evidence, not identities.

---

# Future: Match Ingestion

The intended command format is:

```bash
turfr ingest <file>
```

Example:

```bash
turfr ingest matches/19-august.txt
```

The expected workflow is:

```text
Raw Human Match File
        │
        ▼
turfr CLI
        │
        ▼
turfr-ingest (Python)
        │
        ├── Parse
        ├── Normalize
        ├── Validate
        │
        ▼
Canonical JSON
        │
        ▼
turfr-ingest is finished
        │
        ▼
turfr CLI
        │
        ├── Search existing players
        ├── Resolve identities
        ├── Ask for clarification when ambiguous
        ├── Create players when required
        │
        ▼
Resolved Ingestion Request
        │
        ▼
turfr-api
        │
        ├── Validate domain request
        ├── Check idempotency
        ├── Enforce invariants
        ├── Persist transactionally
        │
        ▼
Database
```

---

# Responsibility Boundaries

## turfr-ingest

`turfr-ingest` is responsible for understanding human-generated match data.

It:

* Parses raw human input.
* Normalizes data.
* Produces canonical structured data.
* Performs ingestion-format validation.

It does not:

* Search for existing players.
* Resolve ambiguous player identities.
* Interact with the operator.
* Call the Turfr API.
* Write directly to the database.

Its output is machine-readable JSON.

---

## turfr-cli

The CLI is responsible for orchestration and human interaction.

It:

* Receives commands.
* Invokes `turfr-ingest`.
* Receives canonical JSON.
* Searches for player candidates through the API.
* Displays candidate information.
* Requests human clarification when required.
* Creates new players when explicitly requested.
* Constructs the resolved API request.
* Sends the request to `turfr-api`.
* Displays the final result.

---

## turfr-api

The API is the authoritative mutation boundary.

It:

* Receives resolved requests.
* Validates domain-level rules.
* Checks idempotency.
* Enforces domain invariants.
* Performs database operations transactionally.
* Returns the authoritative result.

The CLI and `turfr-ingest` do not directly create database truth.

---

# Command Status

| Command                           | Status  | Purpose                                                          |
| --------------------------------- | ------- | ---------------------------------------------------------------- |
| `turfr player add`                | Current | Create a player interactively                                    |
| `turfr player add <name> <phone>` | Current | Create a player with supplied arguments                          |
| `turfr ingest <file>`             | Planned | Ingest a historical match through `turfr-ingest` and `turfr-api` |

---

# Core Mental Model

```text
Human data
    ↓
UNDERSTAND
    ↓
turfr-ingest
    ↓
RESOLVE + ORCHESTRATE
    ↓
turfr-cli
    ↓
AUTHORIZE + PERSIST
    ↓
turfr-api
    ↓
REMEMBER
    ↓
Database
```
