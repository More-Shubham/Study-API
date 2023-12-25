import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { Product, ProductSchema } from '../schema/product.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductController', () => {
  let controller: ProductController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;
  let productId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    productModel = mongoConnection.model(Product.name, ProductSchema);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('Product Controller Testing', () => {
    it('should add product', async () => {
      const res = await controller.create([products]);
      expect(res).toBeTruthy();
    });

    it('should return the all object', async () => {
      const res = await controller.findAll();
      expect(res?.length).toBeTruthy();
      productId = res[0].id;
    });

    it('should return the object by id', async () => {
      const res = await controller.findOne(productId);
      expect(res).toBeTruthy();
    });

    it('should update the object by id', async () => {
      const res = await controller.update(productId, {
        _id: productId,
        ...updateProducts,
      });
      expect(res).toBeTruthy();
    });

    it('should delete the object by id', async () => {
      const res = await controller.remove(productId);
      expect(res).toBeTruthy();
    });

    it('should return the all object empty', async () => {
      const res = await controller.findAll();
      expect(res?.length).toBeFalsy();
    });
  });
});

const products = {
  name: 'Iphone 12',
  price: 400,
};

const updateProducts = {
  name: 'Iphone 13',
  price: 400,
};
