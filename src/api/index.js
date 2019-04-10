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