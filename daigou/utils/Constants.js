const ENV = 'DEV' // PROD or DEV
const CALL_BACKEND = true

const DEV_SERVER = 'https://dev-dot-daigou-dot-fluid-crane-200921.appspot.com'
const PROD_SERVER = 'https://prod-dot-daigou-dot-fluid-crane-200921.appspot.com'

const SERVER = ENV === 'PROD' ? PROD_SERVER : DEV_SERVER

module.exports = {
  ENV,
  SERVER,
  CALL_BACKEND
}