//Văn bản đi
export interface ItemDocumentGo {
  ID: number;
  NumberGo: string;
  NumberSymbol: string;
  DocTypeName: string;
  Compendium: string;
  Deadline: string;
  DateCreated: string;
  UserCreateName: string;
  UserOfHandleName: string;
  StatusName:string;

  BookTypeName: string;
  UnitCreateName: string,
  RecipientsInName: string,
  RecipientsOutName: string,
 // UserOfHandle:number,
 // UserOfCombinate: number,
 // UserOfKnow: number,
  SecretLevelName: string,
  UrgentLevelName: string,
  MethodSendName: string,
 // Signer: number,

//  BookType: string;
//  UnitCreate: number,
//  UserCreate: number,
//  DocType: number,
//  RecipientsIn: number,
//  RecipientsOut: number,
// UserOfHandle:number,
// UserOfCombinate: number,
// UserOfKnow: number,
//  SecretLevel: number,
//  UrgentLevel: number,
//  MethodSend: number,
// Signer: number,
}
export interface IncomingDoc {
  bookType: string;
  numberTo: string;
  numberToSub: number;
  numberOfSymbol: string;
  source: number;
  docType: number;
  promulgatedDate: string;
  dateTo: string;
  compendium: string;
  secretLevel: number;
  urgentLevel: number;
  deadline: string;
  numberOfCopies: number;
  methodReceipt: number;
  userHandle: number;
  note: string;
  isResponse: string;
  isSendMail: string;
  isRetrieve: string;
  signer: string;
}
export interface DocumentGoTicket {
  compendium: string;
  documentID: number;
  userRequest: number;
  userApprover: string;
  deadline: string;
  status: string;
  source: string;
  destination: string;
  taskType: string;
  typeCode: string;
  content: string;
  indexStep: number;
  created: string;
  numberTo: string;
}
//select
export interface ItemSeleted {
  ID: number;
  Title: string;
}
export interface ItemSeletedCode {
  ID: number;
  Title: string;
  Code:string;
}
export interface ItemUser {
  UserId: number,
  UserName: string,
  UserEmail:string
}
export class AttachmentsObject {
  name: string;
  urlFile: string;
}
export const ListDocType: ItemSeleted[] = [
  { ID: 1, Title: 'Báo cáo' },
  { ID: 2, Title: 'Tờ trình' },
  { ID: 3, Title: 'Công văn' },
  { ID: 4, Title: 'Giấy mời' },
  { ID: 5, Title: 'Quyết định' }
];
