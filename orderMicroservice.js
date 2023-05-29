const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const clientcustomers = require("./apiGateway.js").clientCustomers;
const orderProtoPath = "order.proto";
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;
const orders = [
  {
    id: "1",
    total: "60",
    customer: {
      id: "1",
      name: "jhon",
      phone: "23569872",
    },
  },
  {
    id: "2",
    total: "23",
    customer: {
      id: "2",
      name: "yahya",
      phone: "55654782",
    },
  },
];
let global_id = orders.length;

const orderService = {
  getOrder: (call, callback) => {
    const order = {
      id: call.request.order_id,
      total: orders[call.request.order_id].total,
      customer: orders[call.request.order_id].phone,
    };
    callback(null, { order });
  },
  searchOrders: (call, callback) => {
    const { query } = call.request;

    callback(null, { orders });
  },

  createOrder: (call, callback) => {
    const { query } = call.request;
    const order = {
      id: ++global_id,
      total: call.request.total,
      customer: {},
    };
    clientcustomers.getCustomer(
      { customer_id: call.request.customer_id },
      (err, response) => {
        if (!err) {
          order.customer = response.customer;
          orders.push(order);
          callback(null, { order });
        } else {
          callback(null, { order });
        }
      }
    );
  },
  deleteOrder: (call, callback) => {
    const { query } = call.request;
    const order = {
      id: call.request.order_id,
    };
    const delete_id = orders.indexOf(
      orders.find((element) => element.id == order.id)
    );
    orders.splice(delete_id, 1);
    callback(null, { order });
  },
  /*
  updateOrder: (call, callback) => {
    console.log(call.request.order_id);

    const order = {
      id: call.request.order_id,
      name: call.request.name,
      phone: call.request.phone
  
    };
    console.log(order);
    orders[call.request.order_id] = order;
    callback(null, {order});
  },

  deleteOrder: (call, callback) => {
    const { query } = call.request;
    const order = {
      id: call.request.order_id,

    };
    console.log(order);
    orders.pop(order);
    callback(null, {order});
  }
*/
};

const server = new grpc.Server();
server.addService(orderProto.OrderService.service, orderService);
const port = 50053;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }

    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`Order microservice running on port ${port}`);
