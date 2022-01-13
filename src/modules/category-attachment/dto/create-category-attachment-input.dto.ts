import { Category } from '../../categories/models/category.model';
import { FileUpload } from 'graphql-upload';

export class CreateCategoryAttachmentInput {
  readonly category: Category;

  readonly fileUpload: FileUpload;
}
