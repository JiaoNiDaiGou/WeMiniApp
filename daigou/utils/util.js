const BE_ENDPOINT = "https://jiaonidaigou-dot-fluid-crane-200921.appspot.com";
const BE_HEADER = "X-Wx-SessionTicket";

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  BE_ENDPOINT: BE_ENDPOINT,
  formatTime: formatTime
}
