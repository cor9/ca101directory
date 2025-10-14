#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Directories and files to exclude from the markdown
const excludeDirs = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".vercel",
  ".cursor",
];

const excludeFiles = [
  ".DS_Store",
  "Thumbs.db",
  "*.log",
  "*.tmp",
  "*.temp",
  ".env.local",
  ".env.production",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
];

// File extensions to include (common code and config files)
const includeExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".sql",
  ".css",
  ".scss",
  ".sass",
  ".html",
  ".htm",
  ".xml",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".conf",
  ".config",
  ".py",
  ".php",
  ".rb",
  ".go",
  ".rs",
  ".java",
  ".cpp",
  ".c",
  ".h",
  ".hpp",
  ".vue",
  ".svelte",
  ".astro",
  ".elm",
  ".clj",
  ".hs",
  ".ml",
  ".fs",
  ".ex",
  ".exs",
];

// Binary file extensions to exclude
const binaryExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".tiff",
  ".ico",
  ".svg",
  ".webp",
  ".avif",
  ".mp3",
  ".mp4",
  ".avi",
  ".mov",
  ".wmv",
  ".flv",
  ".webm",
  ".ogg",
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",
  ".dmg",
  ".exe",
  ".deb",
  ".rpm",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
];

function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);

  // Check if it's a binary file
  if (binaryExtensions.includes(ext.toLowerCase())) {
    return true;
  }

  // Check if it's in an excluded directory
  for (const excludeDir of excludeDirs) {
    if (
      filePath.includes(`/${excludeDir}/`) ||
      filePath.includes(`\\${excludeDir}\\`)
    ) {
      return true;
    }
  }

  // Check if it's an excluded file
  for (const excludeFile of excludeFiles) {
    if (fileName.includes(excludeFile.replace("*", ""))) {
      return true;
    }
  }

  return false;
}

function shouldInclude(filePath) {
  const ext = path.extname(filePath);

  // Include files with recognized extensions
  if (includeExtensions.includes(ext.toLowerCase())) {
    return true;
  }

  // Include files without extensions (like Dockerfile, README, etc.)
  if (!ext) {
    const fileName = path.basename(filePath);
    // Include common files without extensions
    const includeFiles = [
      "Dockerfile",
      "Makefile",
      "README",
      "LICENSE",
      "CHANGELOG",
      "AUTHORS",
      "CONTRIBUTORS",
    ];
    return includeFiles.some((file) =>
      fileName.toLowerCase().includes(file.toLowerCase()),
    );
  }

  return false;
}

function getLanguageFromExtension(ext) {
  const languageMap = {
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".json": "json",
    ".md": "markdown",
    ".sql": "sql",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",
    ".html": "html",
    ".htm": "html",
    ".xml": "xml",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".py": "python",
    ".php": "php",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".h": "c",
    ".hpp": "cpp",
    ".vue": "vue",
    ".svelte": "svelte",
    ".astro": "astro",
  };

  return languageMap[ext.toLowerCase()] || "text";
}

function getFileTree(dir, baseDir = "", level = 0) {
  const items = [];
  const files = fs.readdirSync(dir);

  // Sort files: directories first, then files
  files.sort((a, b) => {
    const aPath = path.join(dir, a);
    const bPath = path.join(dir, b);
    const aIsDir = fs.statSync(aPath).isDirectory();
    const bIsDir = fs.statSync(bPath).isDirectory();

    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  for (const file of files) {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(baseDir, filePath);

    if (shouldExclude(filePath)) {
      continue;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subItems = getFileTree(filePath, baseDir, level + 1);
      if (subItems.length > 0) {
        items.push({
          type: "directory",
          name: file,
          path: relativePath,
          level: level,
          children: subItems,
        });
      }
    } else if (shouldInclude(filePath)) {
      items.push({
        type: "file",
        name: file,
        path: relativePath,
        level: level,
      });
    }
  }

  return items;
}

function generateMarkdownTree(items, markdown = "") {
  for (const item of items) {
    const indent = "  ".repeat(item.level);

    if (item.type === "directory") {
      markdown += `${indent}- **${item.name}/**\n`;
      if (item.children) {
        markdown = generateMarkdownTree(item.children, markdown);
      }
    } else {
      markdown += `${indent}- ${item.name}\n`;
    }
  }

  return markdown;
}

function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

function generateCodebaseMarkdown(rootDir) {
  const rootPath = path.resolve(rootDir);
  const outputFile = path.join(rootPath, "CODEBASE.md");

  console.log("Generating codebase markdown...");
  console.log("Root directory:", rootPath);

  // Get file tree
  const fileTree = getFileTree(rootPath, rootPath);

  let markdown = `# Codebase Documentation\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += `## Project Structure\n\n`;
  markdown += generateMarkdownTree(fileTree);
  markdown += `\n\n`;

  // Add file contents
  markdown += `## File Contents\n\n`;

  function addFileContents(items, currentPath = "") {
    for (const item of items) {
      if (item.type === "directory") {
        const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
        addFileContents(item.children, newPath);
      } else {
        const fullPath = path.join(rootPath, item.path);
        const content = readFileContent(fullPath);
        const ext = path.extname(item.name);
        const language = getLanguageFromExtension(ext);

        markdown += `### \`${item.path}\`\n\n`;
        markdown += `\`\`\`${language}\n${content}\n\`\`\`\n\n`;
        markdown += `---\n\n`;
      }
    }
  }

  addFileContents(fileTree);

  // Write the markdown file
  fs.writeFileSync(outputFile, markdown, "utf8");

  console.log(`Codebase markdown generated: ${outputFile}`);
  console.log(`Total files included: ${countFiles(fileTree)}`);

  return outputFile;
}

function countFiles(items) {
  let count = 0;
  for (const item of items) {
    if (item.type === "file") {
      count++;
    } else if (item.children) {
      count += countFiles(item.children);
    }
  }
  return count;
}

// Main execution
if (require.main === module) {
  const rootDir = process.argv[2] || ".";
  generateCodebaseMarkdown(rootDir);
}

module.exports = { generateCodebaseMarkdown };

