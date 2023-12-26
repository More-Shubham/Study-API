import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  create(createCartDto: CreateCartDto[]) {
    return this.cartModel.create(...createCartDto);
  }

  findAll() {
    return this.cartModel.find();
  }

  findOne(id: string) {
    return this.cartModel.findOne({ _id: id });
  }

  update(id: string, updateCartDto: UpdateCartDto) {
    return this.cartModel.findOneAndUpdate(
      { _id: id },
      { $set: updateCartDto },
    );
  }

  remove(id: string) {
    return this.cartModel.findOneAndDelete({ _id: id });
  }
}
