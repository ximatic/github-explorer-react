import { Repository, ExplorerPageInfo } from '../models/explorer.model';
import { ExplorerError } from './explorer.errors';

export enum ExplorerEventName {
  VerifyToken = 'verify-token',
  LoadRepositories = 'load-repositories',
  LoadRepository = 'load-repository',
}

export enum ExplorerEventType {
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface ExplorerEvent {
  name: ExplorerEventName;
  type: ExplorerEventType;
  message?: string;
}

export interface ExplorerState {
  token: string | null;
  repositories: Repository[] | null;
  repository: Repository | null;
  pageInfo: ExplorerPageInfo | null;
  error: ExplorerError | null;
  event: ExplorerEvent | null;
}
