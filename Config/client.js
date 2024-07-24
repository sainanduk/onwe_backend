const { createClerkClient } =  require ("@clerk/clerk-sdk-node");

const clerkClient = createClerkClient({
   apiKey: "pk_test_d29uZHJvdXMtZ2hvdWwtNzYuY2xlcmsuYWNjb3VudHMuZGV2JA",     
  secretKey: "sk_test_ASSTqpCPSQa9G2IhofaGRpgmS3RngmBEVE4z8kgOjr",
  jwtKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAupVC/SlO34bTd5qiACt9fiU4w9ekNONxSjHQg2/VGmFZHMQyJ83C8bqJq+pRVn08hODxjHcAqoMkitjafoIOXUHV4mlEkg0/41TddzAgbv2w/kZhuwHI1f8K/L65eyqhH0xyRE9mhVgBfOAfxzGXE8X/HgmiTDExU7fIdAMcYlJpvkRX1T2SjbCmATCmDYqqIx4IzQ2wreKHFp7yiL4xo8TDhIoCvV/cQvkQf05IyZ7Was1kf1lOS/0ZFrKBYo1Eszy0Peslo78lfGOV7QV5j8ELm9Lcsf1peGIFCat2M3zK+eagVuHdD5iXB9aIZD4awmNROFofaz0HSlT4g6d6lwIDAQAB"
});

module.exports = { clerkClient };