import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: `/home`,
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "about" */ './components/Home.vue'),
      children: [
        {
          path: '/home',
          redirect: `/test`,

        },
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "about" */ './views/test.vue'),
        },
      ]
    }
  ]
})


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)

}