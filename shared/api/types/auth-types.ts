import { operations } from '@/shared/api/types/schema'

export interface authTypes {
    registerRequestBodyType: operations['register']['requestBody']['content']['application/json'];
    registerResponseDataType: operations['register']['responses']['201']['content']['application/json'];
    loginRequestBodyType: operations['login']['requestBody']['content']['application/json'];
    loginResponseDataType: operations['login']['responses']['200']['content']['application/json'];
}