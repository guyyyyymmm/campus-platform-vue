import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LostItemsView from "../views/LostItemsView.vue";
import PublishView from "../views/PublishView.vue";
import LoginView from "../views/LoginView.vue";
import SecondHandView from "../views/SecondHandView.vue";
import RegisterView from "../views/RegisterView.vue";
import UserCenterView from "../views/UserCenterView.vue";
import MutualAidView from "../views/MutualAidView.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      path: "/lost-items",
      component: LostItemsView
    },
    {
  path: "/publish",
  component: PublishView,
  meta: {
    requiresAuth: true
  }
},
    {
      path: "/login",
      component: LoginView
    },
    {
  path: "/second-hand",
  component: SecondHandView
    },
    {
  path: "/register",
  component: RegisterView
},
{
  path: "/publish",
  component: () => import("../views/PublishView.vue"),
  meta: {
    requiresAuth: true
  }
},
{
  path: "/user-center",
  component: UserCenterView
},
{
  path: "/mutual-aid",
  component: MutualAidView
}

  ]
});

router.beforeEach(function (to) {
  const user = localStorage.getItem("user");

  if (to.meta.requiresAuth && !user) {
    return "/login";
  }
});

export default router;