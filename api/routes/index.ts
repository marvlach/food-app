import authRoutes from "./auth.routes";
import orderRoutes from "./order.routes";
import menuRoutes from "./menu.routes";
import currencyRoutes from "./currency.routes";

export const routes = {
  auth: authRoutes,
  order: orderRoutes,
  menu: menuRoutes,
  currency: currencyRoutes,
};
