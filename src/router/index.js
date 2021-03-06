import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import user from '@/views/user/user'
import right from '@/views/right/right'
import role from '@/views/right/role'

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
        {path: '/users',name: 'user',component: user},
        {path: '/rights',name: 'right',component: right},
        {path: '/roles',name: 'role',component: role}
      ]
    }
  ]
})
