export interface Deployment {
  id: string;
  name: string;
  createdAt: Date;
  path: string;
  status: 'active' | 'inactive';
  url: string;
  ownerId?: string;
}