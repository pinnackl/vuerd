import { Store } from "../Store";
import { Table, Column } from "../store/Table";
import { Database, NameCase } from "../store/Canvas";
import { getPrimitiveType, getNameCase } from "../helper/GeneratorCodeHelper";
import { orderByNameASC } from "../helper/TableHelper";

const convertTypeMap: { [key: string]: string } = {
  int: "Integer",
  long: "Long",
  float: "Float",
  double: "Double",
  decimal: "BigDecimal",
  boolean: "Boolean",
  string: "String",
  lob: "String",
  date: "LocalDate",
  dateTime: "LocalDateTime",
  time: "LocalTime",
};

export function createCode(store: Store): string {
  const stringBuffer: string[] = [""];
  const { database, tableCase, columnCase } = store.canvasState;
  const tables = orderByNameASC(store.tableState.tables);

  tables.forEach((table) => {
    formatTable(table, stringBuffer, database, tableCase, columnCase);
    stringBuffer.push("");
  });

  return stringBuffer.join("\n");
}

export function formatTable(
  table: Table,
  buffer: string[],
  database: Database,
  tableCase: NameCase,
  columnCase: NameCase
) {
  const tableName = getNameCase(table.name, tableCase);
  if (table.comment.trim() !== "") {
    buffer.push(`// ${table.comment}`);
  }
  buffer.push(`@Data`);
  buffer.push(`public class ${tableName} {`);
  table.columns.forEach((column) => {
    formatColumn(column, buffer, database, columnCase);
  });
  buffer.push(`}`);
}

function formatColumn(
  column: Column,
  buffer: string[],
  database: Database,
  columnCase: NameCase
) {
  const columnName = getNameCase(column.name, columnCase);
  const primitiveType = getPrimitiveType(column.dataType, database);
  if (column.comment.trim() !== "") {
    buffer.push(`  // ${column.comment}`);
  }
  buffer.push(`  private ${convertTypeMap[primitiveType]} ${columnName};`);
}
