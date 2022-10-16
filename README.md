# Rainbow Table

Stores a hash of every possible character combination

## Features

-   Can create a word from a number and vice-versa
-   MD5 hash words as quickly as possible and write them to the database
-   Basic cli:

```
	Commands:
	rainbow run      Fills the table with more data
	rainbow search   Search for a hash in the database
	rainbow hash     Hashes a string
	rainbow convert  Converts a string to a number or vice-versa
	rainbow stats    Shows stats- Convert
```

### Installation

#### Docker Compose

```yaml
version: "3"
services:
    rainbow:
        image: netfloex/rainbow:v0.1.0
        container_name: rainbow
        restart: unless-stopped
        environment:
            DB_HOST: /var/run/postgresql
            NUMBER_FORMAT_LANGUAGE: nl-NL
        volumes:
            - db:/var/run/postgresql

    database:
        image: postgres:14-alpine
        container_name: rainbow-db
        restart: unless-stopped
        environment:
            POSTGRES_DB: rainbow
            POSTGRES_PASSWORD: rainbow-table
        volumes:
            - postgres:/var/lib/postgresql/data
            - db:/var/run/postgresql
volumes:
    postgres:
    db:
```
