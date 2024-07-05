const { createClerkClient } =  require ("@clerk/clerk-sdk-node");

const clerkClient = createClerkClient({
  secretKey: "sk_test_ASSTqpCPSQa9G2IhofaGRpgmS3RngmBEVE4z8kgOjr",
});

module.exports = { clerkClient };