const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const customerProtoPath = "customer.proto";
const orderProtoPath = "order.proto";
const tvShowProtoPath = "tvShow.proto";

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const app = express();
app.use(bodyParser.json());

const customerProtoDefinition = protoLoader.loadSync(customerProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const customerProto = grpc.loadPackageDefinition(
  customerProtoDefinition
).customer;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

const clientCustomers = new customerProto.CustomerService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const clientTVShows = new tvShowProto.TVShowService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
const clientOrders = new orderProto.OrderService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get("/customers", (req, res) => {
  clientCustomers.searchCustomers({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.customers);
    }
  });
});

app.post("/customers", (req, res) => {
  const { id, name, phone } = req.body;
  clientCustomers.createCustomer(
    { customer_id: id, name: name, phone: phone },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.customer);
      }
    }
  );
});

app.put("/customers/:id", (req, res) => {
  const id = req.params.id;
  const { name, phone } = req.body;
  clientCustomers.updateCustomer(
    { customer_id: id, name: name, phone: phone },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.customer);
      }
    }
  );
});

app.delete("/customers/:id", (req, res) => {
  const id = req.params.id;
  clientCustomers.deleteCustomer({ customer_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.customer);
    }
  });
});

app.get("/customers/:id", (req, res) => {
  const id = req.params.id;
  clientCustomers.getCustomer({ customer_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.customer);
    }
  });
});

app.get("/orders", (req, res) => {
  clientOrders.searchOrders({}, (err, response) => {
    console.log(response);
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.orders);
    }
  });
});

app.delete("/orders/:id", (req, res) => {
  const id = req.params.id;
  clientOrders.deleteOrder({ order_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.order);
    }
  });
});

app.post("/orders", (req, res) => {
  const { id, total, customer_id } = req.body;
  clientOrders.createOrder(
    { order_id: id, total: total, customer_id: customer_id },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.customer);
      }
    }
  );
});

app.get("/tvshows", (req, res) => {
  clientTVShows.searchTvshows({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_shows);
    }
  });
});

app.get("/tvshows/:id", (req, res) => {
  const id = req.params.id;
  clientTVShows.getTvshow({ tvShowId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_show);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
module.exports.clientCustomers = clientCustomers;
