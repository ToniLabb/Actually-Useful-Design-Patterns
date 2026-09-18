export class DraftSnapshot {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly savedAt = new Date()
  ) {}
}

export class DraftEditor {
  constructor(
    private title = '',
    private content = ''
  ) {}
  update(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
  save() {
    return new DraftSnapshot(this.title, this.content);
  }
  restore(snapshot: DraftSnapshot) {
    this.title = snapshot.title;
    this.content = snapshot.content;
  }
  view() {
    return { title: this.title, content: this.content };
  }
}

export class VersionHistory {
  private readonly versions: DraftSnapshot[] = [];
  add(snapshot: DraftSnapshot) {
    this.versions.push(snapshot);
  }
  get(version: number): DraftSnapshot {
    const snapshot = this.versions[version];
    if (!snapshot) throw new Error(`Version ${version} does not exist`);
    return snapshot;
  }
  list() {
    return this.versions.map((version, index) => ({
      version: index,
      title: version.title,
      savedAt: version.savedAt
    }));
  }
}

export function run() {
  const editor = new DraftEditor(),
    history = new VersionHistory();
  editor.update('Launch', 'First draft');
  history.add(editor.save());
  editor.update('Launch plan', 'Approved copy');
  history.add(editor.save());
  editor.restore(history.get(0));
  console.log(editor.view(), history.list());
}

if (require.main === module) run();
