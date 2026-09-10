export type Role = 'reader' | 'editor' | 'owner';
export abstract class Resource {
  protected readonly permissions = new Map<string, Role>();
  constructor(public readonly name: string) {}
  grant(userId: string, role: Role): void { this.permissions.set(userId, role) }
  revoke(userId: string): void { this.permissions.delete(userId) }
  getRole(userId: string): Role | undefined { return this.permissions.get(userId) }
  abstract list(indent?: string): string[];
}
export class FileResource extends Resource {
  list(indent = ''){ return [`${indent}${this.name}`] }
}
export class FolderResource extends Resource {
  private readonly children: Resource[] = [];
  add(resource: Resource){ this.children.push(resource); return this }
  grant(userId: string, role: Role): void { super.grant(userId, role); for (const child of this.children) child.grant(userId, role) }
  revoke(userId: string): void { super.revoke(userId); for (const child of this.children) child.revoke(userId) }
  list(indent = ''): string[] { return [`${indent}${this.name}/`, ...this.children.flatMap(child => child.list(`${indent}  `))] }
}
export function run(){
  const project = new FolderResource('project').add(new FileResource('proposal.pdf')).add(new FolderResource('assets').add(new FileResource('logo.png')));
  project.grant('user-42', 'editor');
  console.log(project.list().join('\n'), 'logo role:', (project as FolderResource).getRole('user-42'));
}
if (require.main === module) run();
