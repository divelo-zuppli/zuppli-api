import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { Reference } from './models/reference.model';
import { Category } from '../category/models/category.model';
import { Attachment } from '../attachment/models/attachment.model';

import { ReferenceService } from './reference.service';
import { ReferenceLoaders } from './reference.loaders';

import { CreateReferenceInput } from './dto/create-reference-input.dto';
import { GetOneReferenceInput } from './dto/get-one-reference-input.dto';
import { GetAllReferencesInput } from './dto/get-all-references-input.dto';
import { UpdateReferenceInput } from './dto/update-reference-input.dto';
import { UploadReferenceImageInput } from './dto/upload-reference-image-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Reference)
export class ReferenceResolver {
  constructor(
    private readonly service: ReferenceService,
    private readonly loaders: ReferenceLoaders,
  ) {}

  /* CRUD LOGIC */

  @Mutation(() => Reference, { name: 'createReference' })
  create(
    @Args('createReferenceInput') input: CreateReferenceInput,
  ): Promise<Reference> {
    return this.service.create(input);
  }

  @Query(() => Reference, { name: 'getReference', nullable: true })
  getOne(
    @Args('getOneReferenceInput') input: GetOneReferenceInput,
  ): Promise<Reference> {
    return this.service.getOne(input);
  }

  @Query(() => [Reference], { name: 'getAllReferences' })
  getAll(
    @Args('getAllReferencesInput') input: GetAllReferencesInput,
  ): Promise<Reference[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Reference, { name: 'updateReference' })
  update(
    @Args('getOneReferenceInput') getOneReferenceInput: GetOneReferenceInput,
    @Args('updateReferenceInput') input: UpdateReferenceInput,
  ) {
    return this.service.update(getOneReferenceInput, input);
  }

  @Mutation(() => Reference, { name: 'deleteReference' })
  delete(@Args('getOneReferenceInput') input: GetOneReferenceInput) {
    return this.service.delete(input);
  }

  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  @ResolveField(() => Category, { name: 'category' })
  category(@Parent() parent: Reference): Promise<Category> {
    const value: any = parent.category;

    if (!value) return Promise.resolve(null);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCategories.load(id);
  }

  @ResolveField(() => [Attachment], { name: 'referenceAttachments' })
  referenceAttachments(@Parent() parent: Reference): Promise<Attachment[]> {
    return this.service.referenceAttachments(parent);
  }

  /* RESOLVE FIELDS LOGIC */

  /* EXTRA LOGIC */

  @Mutation(() => Reference, { name: 'uploadReferenceImage' })
  uploadImage(
    @Args('uploadReferenceImageInput')
    uploadReferenceImageInput: UploadReferenceImageInput,
    @Args({ name: 'file', type: () => GraphQLUpload }) fileUpload: FileUpload,
  ): Promise<Reference> {
    return this.service.uploadImage(uploadReferenceImageInput, fileUpload);
  }

  @Mutation(() => Reference, { name: 'deleteReferenceImage' })
  deleteImage(
    @Args('getOneReferenceInput') input: GetOneReferenceInput,
  ): Promise<Reference> {
    return this.service.deleteImage(input);
  }

  /* EXTRA LOGIC */
}
