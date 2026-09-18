export type DocumentData = {
  title: string;
  locale: string;
  sections: { heading: string; content: string }[];
  metadata: Record<string, string>;
};

export class DocumentTemplate {
  constructor(public readonly data: DocumentData) {}
  clone(overrides: Partial<Omit<DocumentData, 'sections' | 'metadata'>> = {}): DocumentTemplate {
    return new DocumentTemplate({ ...structuredClone(this.data), ...overrides });
  }
  setMetadata(key: string, value: string) {
    this.data.metadata[key] = value;
    return this;
  }
  replaceSection(heading: string, content: string) {
    const section = this.data.sections.find((item) => item.heading === heading);
    if (section) section.content = content;
    else this.data.sections.push({ heading, content });
    return this;
  }
}

export class TemplateRegistry {
  private readonly templates = new Map<string, DocumentTemplate>();
  register(name: string, template: DocumentTemplate) {
    this.templates.set(name, template);
  }
  create(name: string): DocumentTemplate {
    const template = this.templates.get(name);
    if (!template) throw new Error(`Unknown template: ${name}`);
    return template.clone();
  }
}

export function run() {
  const registry = new TemplateRegistry();
  registry.register(
    'invoice',
    new DocumentTemplate({
      title: 'Invoice',
      locale: 'en',
      sections: [{ heading: 'Items', content: 'No items' }],
      metadata: { currency: 'EUR' }
    })
  );
  const invoice = registry
    .create('invoice')
    .setMetadata('customer', 'Ada')
    .replaceSection('Items', 'Consulting: 500 EUR');
  console.log(invoice.data);
}

if (require.main === module) run();
