import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto[]) {
    return this.productModel.create(...createProductDto);
  }

  findAll() {
    return this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findOne({ _id: id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findOneAndUpdate(
      { _id: id },
      { $set: updateProductDto },
    );
  }

  remove(id: string) {
    return this.productModel.findOneAndDelete({ _id: id });
  }
}
