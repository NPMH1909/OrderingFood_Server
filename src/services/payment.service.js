import client from "../configs/paypal.config.js";
import paypal from '@paypal/checkout-server-sdk';
import { NotFoundError } from "../errors/notFound.error.js";

const createOrder = async (orderData) => {
    if (!orderData.items || orderData.items.length === 0) {
        throw new NotFoundError("Không có sản phẩm nào trong đơn hàng");
    }

    const items = orderData.items.map(item => ({
        name: item.menuItem.toString(), // Tên sản phẩm
        quantity: item.quantity,
        unit_amount: {
            currency_code: "USD",
            value: (orderData.totalAmount / orderData.items.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2), // Tính giá mỗi sản phẩm
        },
    }));

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: orderData.totalAmount.toFixed(2), 
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: orderData.totalAmount.toFixed(2) // Tổng giá trị của tất cả mặt hàng
                        }
                    }
                },
                items: items
            },
        ],
    });

    try {
        const response = await client.execute(request);
        return response.result; 
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng PayPal:", error);
        throw new Error(`Không thể tạo đơn hàng: ${error.message}`);
    }
}

const capture = async (orderID) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
   
    const response = await client.execute(request);
    return response.result; 
}
export const paymentService = {
    createOrder,
    capture,
}




