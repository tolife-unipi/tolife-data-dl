<img src=./img/logo.png align=right height=150>

# Tolife

> Tool per l'estrapolazione e controllo dei dati raccolti durante i trial clinici svolti nell'ambito del progetto europeo TOLIFE


## Avvio

Per avviare il progetto, per la fase di distribuzione, è possibile utilizzare [Node.js](https://nodejs.org/) o [Docker](https://www.docker.com/) a seconda delle proprie preferenze.

### Node.js

```sh
# Compilazione
npm ci 
npm run build

# Avvio
serve build
```

### Docker

```yaml
version: '3.9'
services:
  tolife:
    container_name: TolifeDownloader
    environment:
      - TZ=Europe/Rome
    ports:
      - 80:3000
    image: tolife:latest
    build: ./
```

## Documentazione

### Autenticazione

<img src=./img/auth.png height=400>

La fase di autenticazione è necessaria per ottenere successivamente i dati dalle REST API (backend).

- Backend: Url delle REST API, lasciare quello di default in caso di dubbi
- Username: Nome utente
- Password: Chiave di accesso

In caso di corretta autenticazione verrà visualizzato un toast con la scritta `Success`, altrimenti, in caso di errore, verrà visualizzato un messaggio con il motivo del problema.

<img src=./img/toast.png height=150>

### Estrazione dei dati

<img src=./img/dashboard.png height=450>

// TODO: