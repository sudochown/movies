import config from './default.json';
import { MovieCRUDActions } from '../types/types';
import validator from 'validator';
import { GridColDef } from '@mui/x-data-grid';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidationRuleType = { func?: keyof typeof validator, own?: string, args?: any, msg?: string };
export type ValueProcessor = Omit<ValidationRuleType, 'msg'>;
export type AttributeConfigType =
  Partial<GridColDef>
  & { validation_rules?: ValidationRuleType[]; value_processor: string[] }

export type AttributeConfig = typeof config.movie.attributes;
export type ApiConfig = typeof config.api;

export function getMovieAttributeConfig(): AttributeConfig {
  return config.movie.attributes || {};
}

export function getFilterFields(): string[] {
  return config?.movie?.filterable || [];
}

export function getSortFields(): string[] {
  return config?.movie?.sortable || [];
}

export function getApiConfig(): ApiConfig {
  return config?.api || {};
}

export function getMovieActionApiUrl(actionType: MovieCRUDActions, id?: string): { method: any; url: string } {
  const apiConfig = getApiConfig();
  let url = `${apiConfig.prefix}${apiConfig.controller}`;
  
  if (id && (actionType === MovieCRUDActions.update || actionType === MovieCRUDActions.delete)) {
    url = `${url}/${id}`;
  }
  
  const { endpoint, method } = apiConfig[actionType as keyof ApiConfig] as { method: any; endpoint: string };
  
  return { url: `${url}${endpoint}`, method: method};
}

export function isFieldValueValid(field: string,  value: any, validationRules: ValidationRuleType[]): string[] {
  const errorMessages = (validationRules).map(({ func, msg, args}) => {
    if (!func) {
      return undefined;
    }

    return (validator[func] && !(validator[func] as CallableFunction)?.(String(value || ''), args)) ? msg : undefined;
  });

  return errorMessages.filter(Boolean) as string[];
}

export function applyValueProcessors(field: string,  value: string | null | number | undefined): any {
  const valueProcessors = getMovieAttributeConfig()?.[field as keyof AttributeConfig]?.value_processor as ValueProcessor[];
  let result = value;
  
  valueProcessors.forEach((processor) => {
    if (processor?.func) {
      result = (validator[processor?.func] as CallableFunction)?.(result);
    }

    if (processor?.own) {
      result = (Object.getPrototypeOf(result)?.[processor?.own] as CallableFunction)?.(result);
    }
  });

  return result;
}
