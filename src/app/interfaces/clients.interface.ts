import {SEXES, CITIES, MARTIAL_STATUS, CITIZENSHIP, DISABILITY, MODES} from '../constants/clients.constant';

export interface IClient {
  _id ?: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDay: string;
  sex: SEXES;
  passportSeries: string;
  passportNumber: string;
  passportIssuer: string;
  passportIssueDate: Date;
  idNumber: string;
  birthPlace: string;
  currentCity: CITIES;
  currentAddress: string;
  mobilePhone ?: string;
  email ?: string;
  registeredCity: CITIES;
  martialStatus: MARTIAL_STATUS;
  citizenship: CITIZENSHIP;
  disability: DISABILITY;
  retired: boolean;
  monthlyIncome ?: number;
}

export interface IDialogData {
  client ?: IClient;
  mode: MODES;
}
