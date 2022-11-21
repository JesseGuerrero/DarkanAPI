module.exports = {
  KEY_PATH: './key.pem',
  CERT_PATH: './csr.pem',
  LOBBY_API_URI: 'http://dev.darkan.org:4040/api/',
  LOBBY_API_KEY: 'TEST_API_KEY',
  LOBBY_MONGO_CONN_URI: 'mongodb://localhost:27017',
  LOBBY_MONGO_DATABASE: 'darkan-server',
  WORLD_MONGO_CONN_URI: 'mongodb://localhost:27017',
  WORLD_MONGO_DATABASE: 'darkan-server',
  JWT_SECRET: 'secretToken',
  PASS_CRYPT: {
    salt: [ 50, 50, 50, 50, -50, -50, -50, -50 ],
    secret: 'secretTokenYeeHaw'
  }
}
