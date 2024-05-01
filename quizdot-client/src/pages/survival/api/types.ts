//src/pages/survival/api/types.ts

export interface iCharacter {
  imageUrl: string;
  title: string;
  nickname: string;
  score?: number;
  isAlive: boolean;
  isRevive: boolean;
}

export interface iCharacterInSurvivalMode extends iCharacter {
  position: {
    top: number;
    left: number;
  };

}
