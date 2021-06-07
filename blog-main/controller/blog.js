//操作数据层面
const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
  let sql =  `select * from blogs where 1=1 `
  if(author) {
    sql += `and author='${author}' `
  }
  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  //返回的是promise
  return await exec(sql)
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`
  let rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) => {
  //blogData是一个博客对象，包含title content属性
  // console.log('newBlog blogData...', blogData)
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createTime = Date.now()
  const sql = `
    insert blogs(title, content, createtime, author)
    values('${title}', '${content}', ${createTime}, '${author}');
  `
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
} 

const updateBlog = async (id, blogData = {}) => {
  //blogData是一个博客对象，包含title content属性
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const sql =  `update blogs set title='${title}',content='${content}' where id=${id};`

  const updateData = await exec(sql)

  if(updateData.affectedRows > 0) {
    return true
  }
  return false
}

const delBlog = async (id, author) => {
  //id为要删除的blog的id
  const sql = `delete from blogs where id='${id}' and author='${author}'`

  const deleteData = await exec(sql)

  if(deleteData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}