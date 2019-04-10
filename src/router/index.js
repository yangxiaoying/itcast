import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import user from '@/views/user/user'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      redirect: {name:'user'},
      children:[
        {path: '/user',name: 'user',component: user}
      ]
    }
  ]
})
