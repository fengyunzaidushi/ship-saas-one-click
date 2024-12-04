export type LanguageCode = 'zh' | 'en' | 'ja';

export interface CharacterInfo {
  gender: string;
  genre: string;
  nameStyle: string;
  traits: string[];
  additionalInfo: string;
  count: number;
}

export interface GeneratedName {
  name: string;
  description: string;
  review: string;
}



export interface ConfigType {
  genderOptions: string[];
  genreOptions: string[];  // 不同文化的文学类型
  nameStyleOptions: string[];  // 命名风格选项
  countOptions: number[];
  defaultTraits: string[];
}