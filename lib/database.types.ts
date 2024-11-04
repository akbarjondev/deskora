import { MergeDeep } from 'type-fest';
import { Database as GeneratedDBTypes } from '@/lib/supabase/database-generated.types';
export type { Json } from './supabase/database-generated.types';

export type Database = MergeDeep<GeneratedDBTypes, {}>;
