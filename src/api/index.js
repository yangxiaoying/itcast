import axios from 'axios'

const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

// 请求拦截器
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('mytoken')
    if(token){
        config.headers['Authorization'] = token
    }
    return config;
});

// 登录验证
export const checkUser = params => {
    return axios.post('login',params).then(res => res.data)
}
// 获取用户列表
export const getUserList = params => {
    return axios.get('users',params).then(res => res.data)
}
// 添加用户
export const addUser = params => {
    return axios.post('users',params).then(res => res.data)
}
// 修改用户状态
export const changeUserState = params => {
    return axios.put(`users/${params.uId}/state/${params.type}`).then(res => res.data)
}
// 根据ID查询用户信息
export const getUserById = params => {
    return axios.get(`users/${params}`).then(res => res.data)
}
// 编辑用户提交
export const updateUser = params => {
    return axios.put(`users/${params.id}`,params).then(res => res.data)
}
// 删除用户
export const deleteUser = params => {
    return axios.delete(`users/${params}`).then(res => res.data)
}
// 获取角色列表
export const getRoleList = params => {
    return axios.get('roles').then(res => res.data)
}
// 分配用户角色
export const grantUserRole = params => {
    return axios.put(`users/${params.id}/role`,params).then(res => res.data)
}
// 获取权限列表
export const getRightList = params => {
    return axios.get(`rights/${params.type}`).then(res => res.data)
}
// 添加角色
export const addRole = params => {
    return axios.post('roles',params).then(res => res.data)
}
// 根据ID查询角色信息
export const getRoleById = params => {
    return axios.get(`roles/${params}`).then(res => res.data)
}
// 编辑角色提交
export const updateRole = params => {
    return axios.put(`roles/${params.id}`,params).then(res => res.data)
}
// 删除角色
export const deleteRole = params => {
    return axios.delete(`roles/${params}`).then(res => res.data)
}
// 分配角色指定权限
export const deleteRight = params => {
    return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data)
}
// 角色授权
export const updateRoleRight = (roleId,rids) => {
    return axios.post(`roles/${roleId}/rights`,rids).then(res => res.data)
}
// 左侧菜单权限
export const getMenuList = params => {
    return axios.get('menus').then(res => res.data)
}