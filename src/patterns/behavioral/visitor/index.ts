export interface DocumentNode { accept<T>(visitor: DocumentVisitor<T>): T }
export class HeadingNode implements DocumentNode {
  constructor(public readonly level: number, public readonly text: string) {}
  accept<T>(visitor: DocumentVisitor<T>){ return visitor.visitHeading(this) }
}
export class ParagraphNode implements DocumentNode {
  constructor(public readonly text: string) {}
  accept<T>(visitor: DocumentVisitor<T>){ return visitor.visitParagraph(this) }
}
export class LinkNode implements DocumentNode {
  constructor(public readonly text: string, public readonly url: string) {}
  accept<T>(visitor: DocumentVisitor<T>){ return visitor.visitLink(this) }
}
export interface DocumentVisitor<T> {
  visitHeading(node: HeadingNode): T;
  visitParagraph(node: ParagraphNode): T;
  visitLink(node: LinkNode): T;
}
export class HtmlVisitor implements DocumentVisitor<string> {
  visitHeading(node: HeadingNode){ return `<h${node.level}>${node.text}</h${node.level}>` }
  visitParagraph(node: ParagraphNode){ return `<p>${node.text}</p>` }
  visitLink(node: LinkNode){ return `<a href="${node.url}">${node.text}</a>` }
}
export class WordCountVisitor implements DocumentVisitor<number> {
  private count(text: string){ return text.trim().split(/\s+/).filter(Boolean).length }
  visitHeading(node: HeadingNode){ return this.count(node.text) }
  visitParagraph(node: ParagraphNode){ return this.count(node.text) }
  visitLink(node: LinkNode){ return this.count(node.text) }
}
export function run(){
  const document: DocumentNode[] = [new HeadingNode(1, 'Useful patterns'), new ParagraphNode('Patterns solve recurring design problems.'), new LinkNode('Read more', '/patterns')];
  console.log(document.map(node => node.accept(new HtmlVisitor())).join(''));
  console.log('Words:', document.reduce((total, node) => total + node.accept(new WordCountVisitor()), 0));
}
if (require.main === module) run();
