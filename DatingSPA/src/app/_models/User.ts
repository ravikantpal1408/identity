import { Photo } from './photo';

// tslint:disable-next-line:no-empty-interface
export interface User {

  id             : number;
  userName       : string;
  knownAs        : string;
  age            : number;
  gender         : string;
  created        : Date;
  lastActive     : Date;
  photoUrl       : string;
  city           : string;
  country        : string;
  interests     ?: string;
  introduction  ?: string;
  lookingFor    ?: string;
  photos        ?: Photo[];
  roles         ?: string[];
}
