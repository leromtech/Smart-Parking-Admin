import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import useAuth from "../scripts/auth";

const { loggedIn, user, fetchUser } = useAuth();

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles; // Roles required by the route
  // Check if the route requires authentication
  if (requiresAuth && !loggedIn()) {
    return next('/'); // Redirect to home or login if not logged in
  }

  try {
    // If user is logged in but user data is not fetched, fetch it
    if (loggedIn() && !user.value) {
      await fetchUser();
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return next('/'); // Redirect to home or login on error
  }

  // If the route has role restrictions, check if the user has the required role(s)
  if (requiredRoles && user.value) {
    const userRoles = user.value.roles.map(role => role.name); // Extract role names

    // Check if the user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return next('/'); // Redirect to a 'Not Authorized' page or any fallback
    }
  }

  // If everything is fine, allow navigation
  next();
});

export default router;
