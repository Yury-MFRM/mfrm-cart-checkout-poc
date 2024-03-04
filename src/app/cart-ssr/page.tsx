import { cookies } from 'next/headers'
import HttpClient from "@/HttpClient";
import OrderSummary from "@/components/order-summary";
import CartLineItemsSsr from "@/components/cart/cart-line-items-ssr";
import Stepper from "@/components/stepper";

async function getCart(cartId: string) {
  return await HttpClient(`/Commerce/Carts('${cartId}')?api-version=7.3`);
}

async function getProductsById(products: string[]) {
  const body = {
    "channelId": 5637154326,
    "productIds": products
  }
  return await HttpClient('/Commerce/Products/GetByIds?$top=1000&api-version=7.3', 'POST', body);
}

async function updateQuantityWithHttpClient(cartId: string, body) {
  const updatedCart = await HttpClient(
    `/Commerce/Carts('${cartId}')/UpdateCartLines?api-version=7.3`,
    'POST',
    body
  )
  return updatedCart
}

export default async function CartPageSsr({ searchParams }) {
  const cookieStore = cookies()
  const cartId = cookieStore.get('mfrm_poc_cart_t1_id').value || '79dd3d1d-8236-4a36-8451-bd7c67d40d72'
  const cart = await getCart(cartId)
  const productIds: string[] = cart.CartLines.map(cl => cl.ProductId);
  const products =  await getProductsById(productIds);

  return (
    <div>
      <div className="header grid grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="header__head col-span-4 lg:col-span-3">
          <h1 className="text-lg font-bold">Shopping Cart</h1>
          <p>Cart Id: {searchParams.id}</p>
          <p>Cart Id from server: {cart?.Id ?? `Loading...`}</p>
        </div>
        <div className="header__stepper col-span-4 lg:col-span-1"><Stepper /></div>
      </div>
      <div className="body grid grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="body__cart-items col-span-4 lg:col-span-3">
          {cart && products && <CartLineItemsSsr cartLineItems={cart.CartLines} products={products.value} />}
        </div>
        <div className="body__order-summary col-span-4 lg:col-span-1">
          {cart && <OrderSummary cart={cart} />}
        </div>
      </div>
    </div>
  )
}
