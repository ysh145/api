import mongoose from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import { TypeComposer } from 'graphql-compose';
import fetch from 'node-fetch';

let ObjectId = mongoose.Schema.Types.ObjectId;

export const ProductSchema = new mongoose.Schema({
  id: {
    type: ObjectId,
    description: 'The key'
  },
  solution: {
    type: String,
    description: 'The solution'
  },
  subSolution: {
    type: String,
    description: 'The sub sulution'
  },
  category: {
    type: String,
    description: 'The category'
  },
  title: {
    type: String,
    description: 'The title'
  },
  description: {
    type: Boolean,
    description: 'The description'
  },
  indication: {
    type: String,
    description: 'The indication'
  },
  specifications: {
    type: String,
    description: 'The specifications'
  },
  productImages: {
    type: [String],
    description: 'The product images'
  },
  specificationImages:{
    type: [String],
    description: 'The product specification images',
  },
  featureImages:{
    type: [String],
    description: 'The product feature images',
  },
  sceneImages:{
    type: [String],
    description: 'The scene images',
  },
  videoFiles:{
    type: [String],
    description: 'The video files',
  },
  pdfFiles:{
    type: [String],
    description: 'The pdf files',
  }
}, {
  collection: 'products',
});

ProductSchema.index({
  title: 'text',
  category: 'text',
  description: 'text',
  indication: 'text',
  specifications: 'text',
}, {
  name: 'ProductTextIndex',
  default_language: 'none',
  weights: {
    title: 10,
    category: 5,
    description: 5,
    indication: 5,
    specifications: 5,
  },
});

export const Product = mongoose.model('Product', ProductSchema);

export const ProductTC = composeWithMongoose(Product);

const findManyResolver = ProductTC.getResolver('findMany')
  .addFilterArg({
    name: 'fullTextSearch',
    type: 'String',
    description: 'Fulltext search with mongodb stemming and weights',
    query: (query, value, resolveParams) => {
      resolveParams.args.sort = {
        score: { $meta: 'textScore' },
      };
      query.$text = { $search: value, $language: 'ru' };
      resolveParams.projection.score = { $meta: 'textScore' };
    },
  });
ProductTC.setResolver('findMany', findManyResolver);
