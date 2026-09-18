export type ImportedRecord = Record<string, string>;

export abstract class DataImporter {
  import(source: string): ImportedRecord[] {
    const raw = this.read(source);
    const parsed = this.parse(raw);
    this.validate(parsed);
    const transformed = parsed.map((record) => this.transform(record));
    this.persist(transformed);
    return transformed;
  }
  protected read(source: string) {
    console.log(`Reading ${source}`);
    return source;
  }
  protected abstract parse(raw: string): ImportedRecord[];
  protected validate(records: ImportedRecord[]) {
    if (records.length === 0) throw new Error('Import contains no records');
  }
  protected transform(record: ImportedRecord) {
    return { ...record, importedAt: new Date(0).toISOString() };
  }
  protected persist(records: ImportedRecord[]) {
    console.log(`Persisted ${records.length} records`);
  }
}

export class CsvImporter extends DataImporter {
  protected parse(raw: string): ImportedRecord[] {
    const [header, ...rows] = raw
      .trim()
      .split('\n')
      .map((line) => line.split(','));
    return rows.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index]])));
  }
}

export class JsonImporter extends DataImporter {
  protected parse(raw: string): ImportedRecord[] {
    return JSON.parse(raw) as ImportedRecord[];
  }
}

export function run() {
  console.log(new CsvImporter().import('name,email\nAda,ada@example.com'));
  console.log(new JsonImporter().import('[{"name":"Grace","email":"grace@example.com"}]'));
}

if (require.main === module) run();
