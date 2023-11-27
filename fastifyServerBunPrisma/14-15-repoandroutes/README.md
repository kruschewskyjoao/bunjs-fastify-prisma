# create migrations
bunx prisma migrate dev --name init


# start application using docker
sh deploy.sh

# test 
psql -h localhost -p 5432 -d fastserver -U fastserver -a -f testdata.sql