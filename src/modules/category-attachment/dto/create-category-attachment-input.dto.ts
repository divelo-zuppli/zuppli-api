import { Category } from '../../category/models/category.model';
import { FileUpload } from 'graphql-upload';

export class CreateCategoryAttachmentInput {
  readonly category: Category;

  readonly fileUpload: FileUpload;
}
