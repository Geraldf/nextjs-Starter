const { Engine } = require("bpmn-engine");

// Sample BPMN XML - Order Processing Workflow
const orderProcessBpmn = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                   xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                   id="Definitions_1" 
                   targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="OrderProcess" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <bpmn:serviceTask id="ValidateOrder" name="Validate Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <bpmn:exclusiveGateway id="Gateway_1" name="Order Valid?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <bpmn:serviceTask id="ProcessPayment" name="Process Payment">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <bpmn:userTask id="ManualReview" name="Manual Review Required">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:userTask>
    
    <bpmn:serviceTask id="ShipOrder" name="Ship Order">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:incoming>Flow_6</bpmn:incoming>
      <bpmn:outgoing>Flow_7</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <bpmn:endEvent id="EndEvent_1" name="Order Completed">
      <bpmn:incoming>Flow_7</bpmn:incoming>
    </bpmn:endEvent>
    
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="ValidateOrder" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="ValidateOrder" targetRef="Gateway_1" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Gateway_1" targetRef="ProcessPayment">
      <bpmn:conditionExpression>\${environment.variables.orderValid === true}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Gateway_1" targetRef="ManualReview">
      <bpmn:conditionExpression>\${environment.variables.orderValid === false}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="ProcessPayment" targetRef="ShipOrder" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="ManualReview" targetRef="ShipOrder" />
    <bpmn:sequenceFlow id="Flow_7" sourceRef="ShipOrder" targetRef="EndEvent_1" />
  </bpmn:process>
</bpmn:definitions>
`;

class OrderProcessingService {
  constructor() {
    this.orders = new Map();
    this.setupEngine();
  }

  setupEngine() {
    // Create engine with custom services
    this.engine = Engine({
      name: "Order Processing Engine",
      source: orderProcessBpmn,
      services: {
        // Custom service implementations
        validateOrder: this.validateOrderService.bind(this),
        processPayment: this.processPaymentService.bind(this),
        shipOrder: this.shipOrderService.bind(this),
      },
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Process start
    this.engine.on("start", () => {
      console.log("🚀 Order processing workflow started");
    });

    // Activity events
    this.engine.on("activity.start", (activity) => {
      console.log(`📋 Activity started: ${activity.name || activity.id}`);
    });

    this.engine.on("activity.end", (activity) => {
      console.log(`✅ Activity completed: ${activity.name || activity.id}`);
    });

    // User task handling
    this.engine.on("activity.wait", (activity) => {
      if (activity.type === "bpmn:UserTask") {
        console.log(`👤 User task waiting: ${activity.name}`);
        this.handleUserTask(activity);
      }
    });

    // Gateway decisions
    this.engine.on("activity.end", (activity) => {
      if (activity.type === "bpmn:ExclusiveGateway") {
        const decision = activity.environment.variables.orderValid
          ? "Valid"
          : "Invalid";
        console.log(`🔀 Gateway decision: Order is ${decision}`);
      }
    });

    // Process completion
    this.engine.on("end", () => {
      console.log("🎉 Order processing workflow completed successfully!");
    });

    // Error handling
    this.engine.on("error", (err, activity) => {
      console.error(`❌ Error in ${activity?.name || "process"}:`, err.message);
    });
  }

  // Service Task: Validate Order
  validateOrderService(activity, next) {
    console.log("🔍 Validating order...");

    const order = activity.environment.variables.order;

    // Simulate validation logic
    setTimeout(() => {
      const isValid =
        order && order.customerId && order.items && order.items.length > 0;

      console.log(`Validation result: ${isValid ? "VALID" : "INVALID"}`);

      // Return validation result
      next(null, {
        orderValid: isValid,
        validationTimestamp: new Date().toISOString(),
      });
    }, 1000);
  }

  // Service Task: Process Payment
  processPaymentService(activity, next) {
    console.log("💳 Processing payment...");

    const order = activity.environment.variables.order;

    // Simulate payment processing
    setTimeout(() => {
      const paymentSuccess = Math.random() > 0.1; // 90% success rate

      if (paymentSuccess) {
        console.log(`Payment processed: $${order.totalAmount}`);
        next(null, {
          paymentProcessed: true,
          transactionId: `TXN-${Date.now()}`,
          paymentTimestamp: new Date().toISOString(),
        });
      } else {
        next(new Error("Payment processing failed"));
      }
    }, 1500);
  }

  // Service Task: Ship Order
  shipOrderService(activity, next) {
    console.log("📦 Shipping order...");

    const order = activity.environment.variables.order;

    // Simulate shipping
    setTimeout(() => {
      const trackingNumber = `TRACK-${Date.now()}`;

      console.log(`Order shipped with tracking: ${trackingNumber}`);

      next(null, {
        shipped: true,
        trackingNumber: trackingNumber,
        shippingTimestamp: new Date().toISOString(),
      });
    }, 1000);
  }

  // Handle user tasks (manual review)
  handleUserTask(activity) {
    const order = activity.environment.variables.order;

    console.log(`Manual review required for order: ${order.orderId}`);
    console.log("Simulating manual approval in 3 seconds...");

    // Simulate manual review process
    setTimeout(() => {
      const approved = Math.random() > 0.2; // 80% approval rate

      if (approved) {
        console.log("✅ Manual review: APPROVED");
        activity.signal({
          manuallyApproved: true,
          reviewTimestamp: new Date().toISOString(),
          reviewerId: "reviewer-123",
        });
      } else {
        console.log("❌ Manual review: REJECTED");
        activity.signal({
          manuallyApproved: false,
          rejectionReason: "Suspicious order pattern",
          reviewTimestamp: new Date().toISOString(),
        });
      }
    }, 3000);
  }

  // Execute order processing workflow
  async processOrder(orderData) {
    console.log(`\n🏪 Processing new order: ${orderData.orderId}`);
    console.log("Order details:", JSON.stringify(orderData, null, 2));

    try {
      const execution = await this.engine.execute({
        variables: {
          order: orderData,
          processStartTime: new Date().toISOString(),
        },
      });

      console.log("\n📊 Final process variables:");
      console.log(JSON.stringify(execution.environment.variables, null, 2));

      return execution;
    } catch (error) {
      console.error("Process execution failed:", error);
      throw error;
    }
  }

  // Get current engine state (for persistence)
  getEngineState() {
    return this.engine.getState();
  }

  // Resume from saved state
  static resumeFromState(state) {
    const resumedEngine = Engine.resume(state);
    console.log("Engine resumed from saved state");
    return resumedEngine;
  }
}

// Demo function
async function runDemo() {
  console.log("🎯 BPMN Engine Demo - Order Processing Workflow\n");

  const orderService = new OrderProcessingService();

  // Sample orders to process
  const orders = [
    {
      orderId: "ORD-001",
      customerId: "CUST-123",
      items: [
        { product: "Laptop", quantity: 1, price: 999.99 },
        { product: "Mouse", quantity: 1, price: 29.99 },
      ],
      totalAmount: 1029.98,
    },
    {
      orderId: "ORD-002",
      customerId: "CUST-456",
      items: [], // Invalid order - no items
      totalAmount: 0,
    },
    {
      orderId: "ORD-003",
      customerId: "CUST-789",
      items: [{ product: "Smartphone", quantity: 2, price: 599.99 }],
      totalAmount: 1199.98,
    },
  ];

  // Process each order
  for (const order of orders) {
    try {
      await orderService.processOrder(order);
      console.log("\n" + "=".repeat(60) + "\n");

      // Wait a bit between orders
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to process order ${order.orderId}:`, error.message);
    }
  }
}

// Error handling for the demo
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { OrderProcessingService };
