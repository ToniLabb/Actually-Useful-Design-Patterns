// Usage: ts-node src/scripts/runDemo.ts <pattern-name>
const pattern = process.argv[2] || process.env.PATTERN;
if (!pattern) {
  console.error('Usage: runDemo <pattern-name>');
  process.exit(1);
}

try {
  // Try direct: ./../patterns/<pattern>/index
  let mod;
  try {
    mod = require(`../patterns/${pattern}/index`);
  } catch (e) {
    // Try category subfolders: creational, structural, behavioral
    const categories = ['creational', 'structural', 'behavioral'];
    for (const c of categories) {
      try {
        mod = require(`../patterns/${c}/${pattern}/index`);
        break;
      } catch (_) {}
    }
  }
  if (mod && typeof mod.run === 'function') mod.run();
  else {
    console.error('Pattern', pattern, 'not found or does not export run()');
    process.exit(1);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('Error loading pattern', pattern, msg);
  process.exit(1);
}
