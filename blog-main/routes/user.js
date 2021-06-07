const { login } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const router = require('koa-router')()

router.prefix('/api/user')


router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body

  const data = await login( username, password )
  if(data.username) {
    ctx.session.username = data.username
    ctx.session.passowrd = data.username
    ctx.body = new SuccessModel()
    return
  }else {
    ctx.body = new ErrorModel('登录失败')
  }
})

module.exports = router