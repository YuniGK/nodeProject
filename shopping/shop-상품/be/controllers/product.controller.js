const Product = require("../models/Product");
const bcrypt = require('bcryptjs');

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, category, description, price, stock, status } = req.body;
        const product = new Product({sku, name, size, image, category, description, price, stock, status});

        await product.save();

        res.status(200).json({status : "create product success", product});

    } catch (error) {
        res.status(400).json({status : "create product fail", message : error.message});
    }
}

productController.getListProduct = async (req, res) => {
    try {
        const {page, name} = req.query;

        const list = null;

        if(name){
            //list = await Product.find({name});
                                                //$regex 포함된 내용을 검색
                                                            //i 대소문자 구분하지 않는다.
            list = await Product.find({name : {$regex:name, $options:"i"}});
        }

        list = await Product.find({});

        res.status(200).json({status : "product list success", list});
    } catch (error) {
        res.status(400).json({status : "product list fail", message : error.message});
    }
}

module.exports = productController;