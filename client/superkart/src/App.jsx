import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./component/layout/RootLayout";
import Home from "./component/home/Home";
import Products from "./component/product/Products";
import ReactTest from "./component/test/ReactTest";
import ProductDetails from "./component/product/ProductDetails";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./component/cart/Cart";
import AddProduct from "./component/product/AddProduct";
import ProductUpdate from "./component/product/ProductUpdate";
import UserRegistration from "./component/user/UserRegistration";
import Login from "./component/auth/Login";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import Unauthorized from "./component/Unauthorized";
import UserProfile from "./component/user/UserProfile";
import Checkout from "./component/checkout/Checkout";
import AuthTest from "./component/test/AuthTest";
import QuickTest from "./component/test/QuickTest";
import AdminOrders from "./component/admin/AdminOrders";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/react-test' element={<ReactTest />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:name' element={<Products />} />
        <Route
          path='/products/category/:categoryId/products/'
          element={<Products />}
        />

        <Route
          path='/product/:productId/details'
          element={<ProductDetails />}
        />
        <Route path='/register' element={<UserRegistration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/checkout/:userId/checkout' element={<Checkout />} />
        <Route path='/auth-test' element={<AuthTest />} />
        <Route path='/quick-test' element={<QuickTest />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route
          element={
            <ProtectedRoute
              useOutlet={true}
              allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
            />
          }>
          <Route path='/user/:userId/my-cart' element={<Cart />} />
          <Route
            path='/user-profile/:userId/profile'
            element={<UserProfile />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute useOutlet={true} allowedRoles={["ROLE_ADMIN"]} />
          }>
          <Route path='/add-product' element={<AddProduct />} />
          <Route
            path='/update-product/:productId/update'
            element={<ProductUpdate />}
          />
          <Route path='/admin/orders' element={<AdminOrders />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
