# Proyecto Final - Primera Entrega

Este proyecto es parte de la primera entrega del curso de backend. Se trata de un servidor desarrollado en Node.js y Express que gestiona productos y carritos de compra para un sistema de e-commerce.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas de la API](#rutas-de-la-api)
  - [Productos](#productos)
  - [Carritos](#carritos)
- [Persistencia de Datos](#persistencia-de-datos)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Descripción

El proyecto consiste en un servidor que escucha en el puerto 8080 y dispone de dos grupos de rutas principales: `/api/products` y `/api/carts`. Estas rutas permiten gestionar productos y carritos de compra, respectivamente.

## Instalación

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. Clona este repositorio:
```bash
   git clone [URL-del-repositorio]
```
   
2. Navega al directorio del proyecto:
```bash
cd [nombre-del-directorio]
```

3. Instala las dependencias necesarias:
```bash
npm install
```

4. Inicia el servidor:
```bash
npm start
```

## Uso

Una vez que el servidor esté en funcionamiento, puedes interactuar con las rutas de la API utilizando herramientas como Postman o cualquier cliente HTTP de tu preferencia.

El servidor estará escuchando en http://localhost:8080.

## Rutas de la API

### Productos

- **GET** `/api/products`: Lista todos los productos. Puedes limitar el número de productos usando el parámetro `?limit`.
- **GET** `/api/products/:pid`: Devuelve un producto específico por su ID.
- **POST** `/api/products`: Agrega un nuevo producto. Los campos requeridos son:
  - `title`: String
  - `description`: String
  - `code`: String
  - `price`: Number
  - `status`: Boolean (true por defecto)
  - `stock`: Number
  - `category`: String
  - `thumbnails`: Array de Strings
  - `demoUrl`: String
- **PUT** `/api/products/:pid`: Actualiza un producto existente por su ID. No se puede actualizar el campo `id`.
- **DELETE** `/api/products/:pid`: Elimina un producto por su ID.

### Carritos

- **POST** `/api/carts`: Crea un nuevo carrito.
- **GET** `/api/carts/:cid`: Lista todos los productos en un carrito específico por su ID.
- **POST** `/api/carts/:cid/product/:pid`: Agrega un producto al carrito por su ID. Si el producto ya existe en el carrito, se incrementa la cantidad.

## Persistencia de Datos

Los datos se almacenan en archivos JSON:

- `products.json` para los productos
- `carts.json` para los carritos

Estos archivos se encuentran en la carpeta `src/files/`.

## Tecnologías Utilizadas

- Node.js
- Express
- File System para la persistencia de datos

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes sugerencias, no dudes en crear un `issue` o enviar un `pull request`.


## Licencia

Este proyecto se distribuye bajo la Licencia MIT.


### Instrucciones:

1. **URL del repositorio**: Reemplaza `[URL-del-repositorio]` con la URL real de tu repositorio en GitHub u otra plataforma.
2. **Nombre del directorio**: Reemplaza `[nombre-del-directorio]` con el nombre de tu directorio de proyecto si es necesario.
3. **Licencia**: Si decides incluir una licencia, asegúrate de crear un archivo `LICENSE` con los términos de la licencia que elijas.
