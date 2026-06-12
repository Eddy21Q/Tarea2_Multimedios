# API Mundiales FIFA

API REST construida con Node.js, Express, SQLite y Zod. Expone informacion sobre ediciones de la Copa Mundial de la FIFA.

## Requisitos

- Node.js 24 o superior
- npm
- xh o httpie para probar las rutas

## Instalacion

```bash
npm install
```

## Poblar la base de datos

```bash
npm run seed
```

El comando crea `db/mundiales.db` y registra 6 ediciones del Mundial.

## Ejecutar

```bash
npm run dev
```

La API queda disponible en:

```txt
http://localhost:4321
```

## Rutas

- `GET /` informacion general del API
- `GET /mundiales` lista resumida
- `GET /mundiales?include=full` lista completa
- `GET /mundial/:slug` detalle de una edicion
- `GET /campeon/:pais` slugs de ediciones ganadas por un pais
- `GET /random` una edicion al azar
- `GET /search/:text` busqueda por texto, minimo 3 caracteres
- `GET /imagenes/:archivo` imagen estatica

## Codigos de respuesta

- `200 OK`: peticion exitosa.
- `400 Bad Request`: validacion de entrada fallida con Zod.
- `404 Not Found`: recurso o ruta no encontrada.

## Pruebas con xh

Con el servidor activo, ejecutar:

```bash
xh GET :4321/mundiales
xh GET :4321/mundiales include==full
xh GET :4321/mundial/qatar-2022
xh GET :4321/mundial/inexistente    # 404 JSON
xh GET :4321/campeon/Argentina
xh GET :4321/random
xh GET :4321/search/final
xh GET :4321/search/ab              # 400 JSON, minimo 3 caracteres
```

Para las capturas del laboratorio use esos comandos completos, incluyendo el status HTTP y el cuerpo JSON que devuelve cada ruta.

## Imagenes

Las imagenes estan en `public/imagenes` y se sirven desde `/imagenes`.

Ejemplo:

```txt
http://localhost:4321/imagenes/qatar-2022.svg
```

Cada registro de la base tiene un campo `imagen` que coincide con un archivo dentro de esa carpeta.
