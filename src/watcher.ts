import { Glob } from "bun";
import { readFileSync, writeFileSync, lstatSync, existsSync } from "node:fs";

export interface Changes {
  [id: string]: {
    [attribute: string]: string | Record<string, string>;
  };
}

/**
 * Given changes, scan for IDs, and write to HTML file.
 */
export function updateFile(file: string, content: string, changes: Changes) {
  const element = '(<a-[\\w]+)';
  const filler = '([^]*?)';
  const whitespace = '[\\s\\n]';
  const propertyDelimit = '["\\s;]';

  Object.keys(changes).forEach(id => {
    // Scan for ID in file.
    const regex = new RegExp(`${element}${filler}(${whitespace})id="${id}"${filler}>`);
    const match = regex.exec(content);
    if (!match) { return; }

    const entitySplit = match[0].split('<a-');
    let entityString = '<a-' + entitySplit[entitySplit.length - 1];
    const originalEntityString = entityString;

    const idWhitespaceMatch = match[3];

    const entityChanges = changes[id];
    if (!entityChanges) return;

    Object.keys(entityChanges).forEach(attribute => {
      const attributeRegex = new RegExp(`(${whitespace})${attribute}="(.*?)(;?)"`);
      const attributeMatch = attributeRegex.exec(entityString);
      const value = entityChanges[attribute];

      if (typeof value === 'string') {
        if (attributeMatch) {
          const whitespaceMatch = attributeMatch[1];
          entityString = entityString.replace(
            new RegExp(`${whitespaceMatch}${attribute}=".*?"`),
            `${whitespaceMatch}${attribute}="${value}"`
          );
        } else {
          entityString = entityString.replace(
            new RegExp(`${idWhitespaceMatch}id="${id}"`),
            `${idWhitespaceMatch}id="${id}" ${attribute}="${value}"`
          );
        }
      } else if (value) {
        Object.keys(value).forEach(property => {
          const attrMatch = attributeRegex.exec(entityString);
          const propertyValue = (value as Record<string, string>)[property];

          if (attrMatch) {
            let attributeString = attrMatch[0];
            const whitespaceMatch = attrMatch[1];
            const propertyRegex = new RegExp(`(${propertyDelimit})${property}:(.*?)([";])`);
            const propertyMatch = propertyRegex.exec(attrMatch[0]);

            if (propertyMatch) {
              const propertyDelimitMatch = propertyMatch[1];
              attributeString = attributeString.replace(
                new RegExp(`${propertyDelimitMatch}${property}:(.*?)([";])`),
                `${propertyDelimitMatch}${property}: ${propertyValue}${propertyMatch[3]}`
              );
            } else {
              attributeString = attributeString.replace(
                new RegExp(`${whitespaceMatch}${attribute}="(.*?)(;?)"`),
                `${whitespaceMatch}${attribute}="${attrMatch[2]}${attrMatch[3]}; ${property}: ${propertyValue}"`
              );
            }
            entityString = entityString.replace(attrMatch[0], attributeString);
          } else {
            entityString = entityString.replace(
              new RegExp(`${idWhitespaceMatch}id="${id}"`),
              `${idWhitespaceMatch}id="${id}" ${attribute}="${property}: ${propertyValue}"`
            );
          }
        });
      }
    });

    content = content.replace(originalEntityString, entityString);
  });

  return content;
}

export function sync(changes: Changes, filePatterns: string[] = ['**/*.html']) {
  let files: string[] = [];
  
  filePatterns.forEach(pattern => {
    try {
      if (existsSync(pattern) && lstatSync(pattern).isDirectory()) {
        const glob = new Glob(pattern.endsWith('/') ? `${pattern}**/*.html` : `${pattern}/**/*.html`);
        files = files.concat([...glob.scanSync('.')]);
      } else {
        const glob = new Glob(pattern);
        files = files.concat([...glob.scanSync('.')]);
      }
    } catch (e) {
      // ignore
    }
  });

  files.forEach(file => {
    try {
      const contents = readFileSync(file, 'utf-8');
      const updated = updateFile(file, contents, changes);
      if (contents !== updated) {
        writeFileSync(file, updated);
        console.log(`[aframe-watcher] Updated ${file}`);
      }
    } catch (e) {
      console.error(`[aframe-watcher] Failed to update ${file}:`, e);
    }
  });
}
