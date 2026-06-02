# Run docker and jupyterlab

### Open WSL and run:

```
cd ../../mnt/c/uoc/git/treb_assig_ipc/VIS/PRA2/enso_mediterrania/docker/
docker compose up
```
with `--build` if the docker files change

### In firefox, go to:
```
http://localhost:8888/
```

### To close docker:
```
docker compose down -v
```