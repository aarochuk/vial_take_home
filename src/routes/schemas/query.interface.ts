export interface IQuery {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
    formData: IFormData
    formDataId: string
}
  
export interface ICountedFormData {
    total: number
    formData: IFormData[]
}
  