const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const customerProtoPath = "customer.proto";
const customerProtoDefinition = protoLoader.loadSync(customerProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const customerProto = grpc.loadPackageDefinition(
  customerProtoDefinition
).customer;

const customers = [
  {
    id: "1",
    name: "jhon",
    phone: "23569872",
  },
  {
    id: "2",
    name: "yahya",
    phone: "55654782",
  },
];

let global_id = customers.length;

const customerService = {
  getCustomer: (call, callback) => {
    const update_id = customers.indexOf(
      customers.find((element) => element.id == call.request.customer_id)
    );
    const customer = {
      id: call.request.customer_id,
      name: customers[update_id].name,
      phone: customers[update_id].phone,
    };
    callback(null, { customer });
  },

  searchCustomers: (call, callback) => {
    const { query } = call.request;
    callback(null, { customers });
  },

  createCustomer: (call, callback) => {
    const { query } = call.request;
    const customer = {
      id: ++global_id,
      name: call.request.name,
      phone: call.request.phone,
    };
    customers.push(customer);
    callback(null, { customer });
  },

  updateCustomer: (call, callback) => {
    const customer = {
      id: call.request.customer_id,
      name: call.request.name,
      phone: call.request.phone,
    };
    const update_id = customers.indexOf(
      customers.find((element) => element.id == customer.id)
    );
    customers[update_id] = customer;
    callback(null, { customer });
  },

  deleteCustomer: (call, callback) => {
    const { query } = call.request;
    const customer = {
      id: call.request.customer_id,
    };
    const delete_id = customers.indexOf(
      customers.find((element) => element.id == customer.id)
    );
    customers.splice(delete_id, 1);
    callback(null, { customer });
  },
};

const server = new grpc.Server();
server.addService(customerProto.CustomerService.service, customerService);
const port = 50051;
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
console.log(`Customer microservice running on port ${port}`);
