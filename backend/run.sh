docker stop server
docker rm server
docker rmi server
docker build -t server .
docker run -d --name server -p 2000:2000 server
docker logs -f server