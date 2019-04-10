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