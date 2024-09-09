docker stop frontend
docker rm frontend
docker rmi frontend
docker build -t frontend .
docker run -d --name frontend -p 3000:3000 frontend
docker logs -f frontend