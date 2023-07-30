import api from '../api/products.js';
import fs from "fs";

////////////////////////////////////////////////////////////////////////////////
//                                 GET Controller                             //
////////////////////////////////////////////////////////////////////////////////

const getProducts = async (req, res,) => {
    res.json(await api.getProducts());
};

const getProduct = async (req, res) => {
    const id = req.params.id;
    res.json(await api.getProduct(id));
};

///////////////////////////////////////////////////////////////////////////////
//                                POST Controller                            //
///////////////////////////////////////////////////////////////////////////////

const postProduct = async (req, res) => {
    const product = req.body;
    product.price = Number(product.price); 
    product.stock = Number(product.stock); 
    product.ageFrom = Number(product.ageFrom); 
    product.ageUpTo = Number(product.ageUpTo);
    product.freeShipping = (product.freeShipping==="on") ? true : false;

    const image = req.files.mainPhoto;
    const imageName = Date.parse(Date())+image.name.slice(image.name.lastIndexOf("."));
    const uploadPath = './public/img/products/' +imageName;
    product.mainPhoto = imageName;
    image.mv(uploadPath, async function(err) {
        if (err){
            return res.status(500).send(err);}
        const createdProduct = await api.createProduct(product);
        res.json(createdProduct);
    });
};

///////////////////////////////////////////////////////////////////////////////
//                                 PUT Controller                            //
///////////////////////////////////////////////////////////////////////////////

const putProduct = async (req, res) => {
    const id = req.params.id;
    const product = req.body;
    const updatedProduct = await api.updateProduct(id, product);
    res.json(updatedProduct);
};

///////////////////////////////////////////////////////////////////////////////
//                               DELETE Controller                           //
///////////////////////////////////////////////////////////////////////////////

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await api.deleteProduct(id);
    fs.unlinkSync('./public/img/products/'+ deletedProduct.mainPhoto)
    res.json(deletedProduct);
};


export default {
    getProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct
};