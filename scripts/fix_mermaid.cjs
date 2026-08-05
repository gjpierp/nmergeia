const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  
  content = content.replace(mermaidRegex, (match, p1) => {
    let block = p1;
    let originalBlock = p1;
    
    let subCounter = 0;
    // Fix subgraphs without brackets: subgraph Some Title -> subgraph sub_x [Some Title]
    block = block.replace(/^(\s*)subgraph\s+([A-Za-z0-9_]+)$/gm, (m, space, id) => m);
    block = block.replace(/^(\s*)subgraph\s+(?!.*\b(?:id|sub_)[0-9]+\b\s*\[)(.+)$/gm, (m, space, title) => {
        if (!title || (title.includes('[') && title.includes(']'))) return m;
        subCounter++;
        return space + "subgraph sub_" + subCounter + " [" + title.trim() + "]";
    });

    // Fix A -- text --> B to A -->|text| B
    block = block.replace(/ -- (.*?) --> /g, ' -->|$1| ');

    // Remove single quotes and backticks as they cause parser errors in some mermaid labels
    block = block.replace(/'/g, '');
    block = block.replace(/`/g, '');
    block = block.replace(/¿/g, '');
    block = block.replace(/\?/g, '');

    if (block !== originalBlock) {
        hasChanges = true;
    }
    return '```mermaid' + block + '```';
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated Mermaid in: " + filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.md')) {
      processFile(fullPath);
    }
  });
}

walkDir('C:\\Local\\nmerge\\public\\docs');
console.log("Mermaid fix completed.");
