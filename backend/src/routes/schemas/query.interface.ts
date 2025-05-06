import { IFormData } from './formData.interface';

export interface IQuery {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  formDataId: string;
}

export interface CreateQuery{
  title: string;
  description: string;
  formDataId: string;
}

export interface UpdateQuery {
  status: string;
}