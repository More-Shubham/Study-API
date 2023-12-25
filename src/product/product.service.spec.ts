import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product, ProductSchema } from '../schema/product.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';

describe('ProductService', () => {
  let service: ProductService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;
  let productId: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    productModel = mongoConnection.model(Product.name, ProductSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('Product Service Testing', () => {
    it('should add product', async () => {
      const res = await service.create([products]);
      expect(res).toBeTruthy();
    });

    it('should return the all object', async () => {
      const res = await service.findAll();
      expect(res?.length).toBeTruthy();
      productId = res[0].id;
    });

    it('should return the object by id', async () => {
      const res = await service.findOne(productId);
      expect(res).toBeTruthy();
    });

    it('should update the object by id', async () => {
      const res = await service.update(productId, {
        _id: productId,
        ...updateProducts,
      });
      expect(res).toBeTruthy();
    });

    it('should delete the object by id', async () => {
      const res = await service.remove(productId);
      expect(res).toBeTruthy();
    });

    it('should return the all object empty', async () => {
      const res = await service.findAll();
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
