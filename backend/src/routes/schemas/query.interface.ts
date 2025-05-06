// Interface for Query
export interface IQuery {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  formDataId: string;
}

// Interface to Create a Query
export interface CreateQuery{
  title: string;
  description: string;
  formDataId: string;
}

// Interface to Update a Query
export interface UpdateQuery {
  title?: string;
  description?: string;
  status?: string;
}