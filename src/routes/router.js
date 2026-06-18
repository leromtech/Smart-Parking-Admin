import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import useAuth from "../scripts/auth";

const { loggedIn, user, fetchUser } = useAuth();

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

// Lightweight route progress bar
let progressTimer = null;
const startProgress = () => {
  const bar = document.getElementById("route-progress");
  if (!bar) return;
  bar.style.width = "0%";
  bar.style.opacity = "1";
  bar.style.transition = "none";
  // Force reflow
  bar.offsetHeight;
  bar.style.transition = "width 0.3s ease";
  bar.style.width = "30%";
  clearTimeout(progressTimer);
  progressTimer = setTimeout(() => {
    bar.style.transition = "width 6s ease-out";
    bar.style.width = "85%";
  }, 300);
};

const finishProgress = () => {
  const bar = document.getElementById("route-progress");
  if (!bar) return;
  clearTimeout(progressTimer);
  bar.style.transition = "width 0.2s ease, opacity 0.3s ease";
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.opacity = "0";
    setTimeout(() => {
      bar.style.width = "0%";
      bar.style.transition = "none";
    }, 300);
  }, 200);
};

// Role-based redirect mapping
const roleRedirects = {
  owner: "/parking-zone",
  customer: "/customer",
  manager: "/manager",
};

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;

  // Check if the route requires authentication
  if (requiresAuth && !loggedIn()) {
    return next("/");
  }

  try {
    // If user is logged in but user data is not fetched, fetch it
    if (loggedIn() && !user.value) {
      await fetchUser();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return next("/");
  }

  // If the route has role restrictions, check if the user has the required role(s)
  if (requiredRoles && user.value) {
    const userRoles = user.value.roles.map((role) => role.name);

    // Allow superadmin role to access any route
    if (userRoles.includes("superadmin")) {
      return next();
    }

    // Check if the user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect based on user's primary role
      const primaryRole = userRoles[0];
      const redirectPath = roleRedirects[primaryRole] || "/";
      return next(redirectPath);
    }
  }

  // If everything is fine, allow navigation
  startProgress();
  next();
});

router.afterEach(() => {
  finishProgress();
});

export default router;
