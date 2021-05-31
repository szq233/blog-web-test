const { exec } = require('../db/mysql')

const login = (username, password) => {

  const sql = `
    select username,realname from users where username='${username}' and password='${password}';
  `
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
  //先使用假数据
  // if(username === 'admin' && password === '123') {
  //   return true
  // }
  // return false
}

module.exports = { login }