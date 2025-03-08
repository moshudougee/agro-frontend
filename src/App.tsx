import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminLayout from "./components/admin/AdminLayout"
import FertlizersPage from "./pages/admin/FertlizersPage"
import SeedsPage from "./pages/admin/SeedsPage"
import OrdersPage from "./pages/admin/OrdersPage"
import AddFertPage from "./pages/admin/AddFertPage"
import AddSeedsPage from "./pages/admin/AddSeedsPage"
import ContactsPage from "./pages/ContactsPage"
import ContEditPage from "./pages/ContEditPage"
import CartPage from "./pages/CartPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import OrderPage from "./pages/admin/OrderPage"
import MyOrderPage from "./pages/MyOrderPage"


const App = () => {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/edit" element={<ContEditPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:orderId" element={<MyOrderPage />} />
        </Route>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<OrdersPage />} />
          <Route path="/dashboard/fertilizers" element={<FertlizersPage />} />
          <Route path="/dashboard/fertilizers/add" element={<AddFertPage />} />
          <Route path="/dashboard/seeds" element={<SeedsPage />} />
          <Route path="/dashboard/seeds/add" element={<AddSeedsPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/orders/:orderId" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
