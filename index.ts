import { v4 as uuidv4, validate as validateUuid } from 'uuid';

// 新しいUUIDを生成する
const newUuid = uuidv4();
console.log('New UUID:', newUuid);

// UUIDの妥当性を確認する
const isValid = validateUuid(newUuid);
console.log('Is Valid UUID:', isValid);