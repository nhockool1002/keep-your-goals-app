# KEEP YOUR GOALS APPLICATION

Backend API: http://localhost:3000
PostgreSQL: localhost:5432
pgAdmin: http://localhost:5050 (goals999@admin.com/goals999)
RedisInsight: http://localhost:8001
Kibana: http://localhost:5601/

## DATABASE 

### Yêu cầu bật extension hỗ trợ UUID cho PostgreSQL
```
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## BACKEND - NEST JS 
Create new controllers 
```
nest generate controller {controller_name}
```

RUN MIGRATE PRISMA (First time)
```
npx prisma migrate dev --name init
```

WHEN UPDATE PRISMA SCHEMA
```
npx prisma migrate dev --name {reason update}
Ex: npx prisma migrate dev --name add_goal_labels_table
```

CREATE PRISMA CLIENT
```
npx prisma generate
```

VIEW MIGRATE RESULT IN UI
```
npx prisma studio
```

SEED COMMAND
```
yarn prisma db seed
```

Install Prisma for BE
```
docker exec -it be-keep-your-goals npx prisma migrate dev --name init
docker exec -it be-keep-your-goals npx prisma db seed
```

Install Prisma Seed / Faker
```
yarn add @prisma/client
yarn add -D prisma @faker-js/faker
```

Command create module service controller
```
nest g module {PAPAP}
nest g service {PAPAP}
nest g controller {PAPAP}
nest g resource {PAPAP} ~> Lệnh tạo nhanh
```

### Setup PGADMIN 
```
NAME: KEEP YOUR GOAL APP (or anything)
HOSTNAME: db-keep-your-goals
PORT: 5432
DB: keep_your_goals_db
USERNAME: goals999
PASSWORD: goals999
```