const BE_SERVER = 'https://dev-dot-fluid-crane-200921.appspot.com';

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

const formatCustomerContactToString = (name, phone, address) => {
  var n = '';
  if (!!name) {
    n += '(姓名)' + name + '  '; 
  }
  if (!!phone) {
    n += '(电话)' + phone + '  ';
  }
  if (!!address) {
    if (!!address.region) {
      n += '(省)' + address.region + '  ';
    }
    if (!!address.city) {
      n += '(市)' + address.city + '  ';
    }
    if (!!address.zone) {
      n += '(区)' + address.zone + '  ';
    }
    if (!!address.address) {
      n += '(地址)' + address.address
    }
  }
  return n.trim();
}

module.exports = {
  BE_SERVER: BE_SERVER,

  formatTime: formatTime,
  formatCustomerContactToString: formatCustomerContactToString
}
