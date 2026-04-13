export interface SqlDto {
  columnSelect?: string;
  fromTable: string;
  whereColumn?: string;
  orderBy?: string;
  joinset?:string;
  values?: string;
}