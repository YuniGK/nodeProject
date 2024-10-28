
const { populate } = require("dotenv");
const Cart = require("../models/Cart");
const { patch } = require("../routes/cart.api");
const Product = require("../models/Product");

const cartController = {};

cartController.addToCart = async (req, res) => {
    try {
        const {userId} = req;
        const {productId, size, qty} = req.body;

        //카트 존재 여부를 위해 조회
        let cart = await Cart.findOne({userId});

        //없으면 카트 생성
        if(!cart){
            cart = new Cart({userId});
            await cart.save();
        }

        //카트에 존재하는 상품인지 ? 에러 : 추가
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );

        if(existItem){ 
            throw new Error("이미 존재하는 상품입니다.");
        }

        //카트에 아이템을 추가
                    //새로운 배열을 만들어, 내용을 추가한다.
        cart.items = [...cart.items, {productId, size, qty}];

        await cart.save();
                                                                        //카트 상품 수량수
        res.status(200).json({status : "cart add success", data : cart, cartItemQty : cart.items.length});
    } catch (error) {
        res.status(400).json({status : "cart add fail", message : error.message});
    }
}

cartController.getCart = async (req, res) => {
    try {
        const {userId} = req;

        let cart = await Cart.findOne({userId})
            .populate({
                path :  'items'
                , populate : {
                    path : 'productId'
                    , model : 'Product'
                }
            });
            /*
            populate - join과 유사한 의미 
            items에서 productId를 이용해 
            Product에서 데이터를 가져온다.
            */

        res.status(200).json({status : "get cart success", data : cart.items});
    } catch (error) {
        res.status(400).json({status : "get cart fail", message : error.message});
    }
}

cartController.deleteCartItem = async (req, res) =>{
    try {
        const {userId} = req;
        const {productId} = req.body;

        let cart = await Cart.updateOne({userId}
            , {$pullAll: {"items": [productId]}}
            , {'new' : true}
        );

        res.status(200).json({status : "delte cart success", data : cart});
    } catch (error) {
        res.status(400).json({status : "delete cart item fail", message : error.message});
    }
}

cartController.updateQty = async (req, res) =>{
    try {
        const {userId} = req;
        const {productId, qty} = req.body;

        const cart = await Cart.updateOne(
            { userId },
            {
              $push: { items: { productId, qty } },
            },
          );
    } catch (error) {
        res.status(400).json({status : "delete cart item fail", message : error.message});
    }
}

module.exports = cartController;