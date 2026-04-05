import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      //   name: 'home',
      //   component: HomeView,
      redirect: { name: 'schemes' },
    },
    {
      path: '/schemes',
      name: 'schemes',
      component: () => import('@v/SchemeView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'schemes' }, // Or redirect to a custom 404 component
    },
  ],
})

export default router
