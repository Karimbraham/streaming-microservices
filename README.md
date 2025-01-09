# Microservices with gRPC and REST API Gateway

This is a simple example of an **API Gateway** that integrates multiple microservices using both **gRPC** and **REST**. The API Gateway acts as the central entry point for different services such as `Customer`, `Order`, and `TVShow`, which communicate via gRPC, while also providing RESTful endpoints for easier access.

## Features

- **gRPC Integration:** Microservices communicate via gRPC for efficient, fast communication.
- **RESTful Endpoints:** Exposes RESTful endpoints to handle requests for customer, order, and TV show data.
- **GraphQL Server:** Uses Apollo Server to provide a GraphQL API for flexible querying.

## Technologies 

- **Node.js**: JavaScript runtime for server-side code.
- **gRPC**: High-performance RPC framework for microservices communication.
- **Apollo Server**: For creating the GraphQL API.
- **Express.js**: Web framework to build the REST API Gateway.
- **ProtoBuf**: Protocol Buffers for gRPC service definitions.

## How it Works

### Microservices

- **Customer Service (gRPC)**: Handles customer-related operations such as creating, updating, and deleting customers.
- **Order Service (gRPC)**: Manages orders, including searching and deleting orders.
- **TV Show Service (gRPC)**: Manages TV show data.

The API Gateway integrates all services, exposing the following functionality:

- **Customer Operations (REST)**:
  - `GET /customers`: Fetch all customers.
  - `GET /customers/:id`: Fetch a customer by ID.
  - `POST /customers`: Create a new customer.
  - `PUT /customers/:id`: Update customer details.
  - `DELETE /customers/:id`: Delete a customer.

- **Order Operations (REST)**:
  - `GET /orders`: Fetch all orders.
  - `POST /orders`: Create a new order.
  - `DELETE /orders/:id`: Delete an order.

- **TV Show Operations (REST)**:
  - `GET /tvshows`: Fetch all TV shows.
  - `GET /tvshows/:id`: Fetch a TV show by ID. 

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/Karimbraham/streaming-microservices.git
   cd streaming-microservices
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the API Gateway:
   ```bash
   npm start
   ```

4. The API Gateway will now be accessible on `http://localhost:3000`.

## Future Improvements

- Implement authentication and authorization for API endpoints.
- Add caching for frequently accessed data.
- Improve error handling and validation. 
 
