//Văn bản đi
export interface DocumentGo {
    ID: number;
    NumberGo: string;
    NumSymbol: string;
    DocTypeName: string;
    Compendium: string;
    Deadline: Date;
    DateCreated: Date;
    UserCreateName: string;
    UserOfHandle :string
  }
  export const ListDocumentGo:DocumentGo[]=[
      
  ]
  //loại văn bản
  export interface DocType{
      ID:number;
      Title:string;
  }
  
  export const ListDocType:DocType[]=[
      {ID:1,Title:'Báo cáo'},
      {ID:2,Title:'Tờ trình'},
      {ID:3,Title:'Công văn'},
      {ID:4,Title:'Giấy mời'},
      {ID:5,Title:'Quyết định'},
]