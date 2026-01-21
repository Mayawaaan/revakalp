import React from 'react';
import useStore from '../../store/store';
import Title from '../globalComponents/Title';
import {
    AlertCircle
} from 'lucide-react';

const CartTotal = ({
    productError
}) => {
    const {
        cart,
        currency,
        getCartSubtotal,
        getCartTotal,
        getDeliveryFee,
        discountPercentage,
    } = useStore();
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const deliveryFee = getDeliveryFee();
    const discountAmount =
        subtotal === 0 ? 0 : Math.floor((subtotal * discountPercentage) / 100);

    return ( <
        div className = "w-full" >
        <
        div className = "text-2xl" >
        <
        Title text1 = {
            'CART'
        }
        text2 = {
            'ITEMS'
        }
        /> <
        /div>

        <
        div className = "flex flex-col gap-4 mt-4" > {
            cart.map((item) => ( <
                div key = {
                    item._id
                }
                className = {
                    `flex justify-between items-center p-2 rounded-lg ${
            productError === item._id ? 'bg-red-100 border border-red-500' : ''
          }`
                } >
                <
                div className = "flex items-center gap-4" >
                <
                img src = {
                    item.image
                }
                alt = {
                    item.name
                }
                className = "w-16 h-16 object-cover rounded-md" /
                >
                <
                div >
                <
                p className = "font-semibold" > {
                    item.name
                } < /p> <
                p className = "text-sm text-gray-600" >
                Qty: {
                    item.quantity
                } <
                /p> <
                /div> <
                /div> <
                p > {
                    currency
                } {
                    item.price * item.quantity
                }.00 < /p> {
                    productError === item._id && ( <
                        div className = "flex items-center gap-2 text-red-600" >
                        <
                        AlertCircle size = {
                            16
                        }
                        /> <
                        p className = "text-xs" > Item unavailable < /p> <
                        /div>
                    )
                } <
                /div>
            ))
        } <
        /div>

        <
        div className = "text-2xl mt-8" >
        <
        Title text1 = {
            'CART'
        }
        text2 = {
            'TOTALS'
        }
        /> <
        /div>

        <
        div className = "flex flex-col gap-2 mt-2 text-sm" >
        <
        div className = "flex justify-between" >
        <
        p > Subtotal < /p> <
        p > {
            currency
        } {
            subtotal
        }.00 < /p> <
        /div> <
        hr / >
        <
        div className = "flex justify-between" >
        <
        p > Shipping Fee < /p> <
        p > {
            deliveryFee === 0 ? ( <
                span className = "text-green-600" > Free < /span>
            ) : (
                `${currency} ${deliveryFee}.00`
            )
        } <
        /p> <
        /div> <
        hr / > {
            discountPercentage > 0 && ( <
                >
                <
                div className = "flex justify-between text-green-600" >
                <
                p > Discount({
                    discountPercentage
                } %) < /p> <
                p > - {
                    currency
                } {
                    discountAmount
                }.00 < /p> <
                /div> <
                hr / >
                <
                />
            )
        } <
        div className = "flex justify-between" >
        <
        b > Total < /b> <
        b > {
            currency
        } {
            total
        }.00 < /b> <
        /div> <
        /div> <
        /div>
    );
};

export default CartTotal;