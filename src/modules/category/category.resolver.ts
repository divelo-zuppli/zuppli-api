import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { CategoryService } from './category.service';
import { CategoryLoaders } from './category.loaders';

import { Category } from './models/category.model';
import { Attachment } from '../attachment/models/attachment.model';

import { CreateCategoryInput } from './dto/create-category-input.dto';
import { GetOneCategoryInput } from './dto/get-one-category-input.dto';
import { GetAllCategoriesInput } from './dto/get-all-categories-input.dto';
import { UpdateCategoryInput } from './dto/update-category-input.dto';
import { UploadCategoryImageInput } from './dto/upload-category-image-input.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly service: CategoryService,
    private readonly loaders: CategoryLoaders,
  ) {}

  /* CRUD LOGIC */

  @Mutation(() => Category, { name: 'createCategory' })
  create(
    @Args('createCategoryInput') input: CreateCategoryInput,
  ): Promise<Category> {
    return this.service.create(input);
  }

  @Query(() => Category, { name: 'getCategory', nullable: true })
  getOne(
    @Args('getOneCategoryInput') getOneCategoryInput: GetOneCategoryInput,
  ): Promise<Category> {
    return this.service.getOne(getOneCategoryInput);
  }

  @Query(() => [Category], { name: 'getAllCategories', nullable: true })
  getAll(
    @Args('getAllCategoriesInput') input: GetAllCategoriesInput,
  ): Promise<Category[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  update(
    @Args('getOneCategoryInput') getOneCategoryInput: GetOneCategoryInput,
    @Args('updateCategoryInput') input: UpdateCategoryInput,
  ) {
    return this.service.update(getOneCategoryInput, input);
  }

  @Mutation(() => Category, { name: 'deleteCategory' })
  delete(
    @Args('getOneCategoryInput') getOneCategoryInput: GetOneCategoryInput,
  ) {
    return this.service.delete(getOneCategoryInput);
  }

  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  @ResolveField(() => Category, { name: 'parent', nullable: true })
  parent(@Parent() parent: Category): Promise<Category> {
    const value: any = parent.parent;

    if (!value) return Promise.resolve(null);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCategories.load(id);
  }

  @ResolveField(() => [Category], { name: 'children' })
  public children(@Parent() parent: Category): Promise<Category[]> {
    return this.service.children(parent);
  }

  @ResolveField(() => [Attachment], { name: 'attatchments' })
  public attatchments(@Parent() parent: Category): Promise<Attachment[]> {
    return this.service.attatchments(parent);
  }

  /* RESOLVE FIELDS LOGIC */

  /* EXTRA LOGIC */

  @Mutation(() => Category, { name: 'uploadCategoryImage' })
  uploadImage(
    @Args('uploadCategoryImageInput')
    uploadCategoryImageInput: UploadCategoryImageInput,
    @Args({ name: 'file', type: () => GraphQLUpload }) fileUpload: FileUpload,
  ): Promise<Category> {
    return this.service.uploadImage(uploadCategoryImageInput, fileUpload);
  }

  @Mutation(() => Category, { name: 'deleteCategoryImage' })
  deleteImage(
    @Args('getOneCategoryInput') getOneCategoryInput: GetOneCategoryInput,
  ): Promise<Category> {
    return this.service.deleteImage(getOneCategoryInput);
  }

  /* EXTRA LOGIC */
}
