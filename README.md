# KEEP YOUR GOALS APPLICATION

Backend API: http://localhost:3000
PostgreSQL: localhost:5432
pgAdmin: http://localhost:5050 (goals999@admin.com/goals999)
RedisInsight: http://localhost:8001
Kibana: http://localhost:5601/


## BACKEND - NEST JS 
Create new controllers 
```
nest generate controller {controller_name}
```

Install Prisma for BE
```
docker exec -it be-keep-your-goals npx prisma migrate dev --name init
docker exec -it be-keep-your-goals npx prisma db seed
```