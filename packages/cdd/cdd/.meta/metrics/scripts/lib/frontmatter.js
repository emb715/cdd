#!/usr/bin/env node

/**
 * Frontmatter Utility
 * 
 * Provides functions to read, parse, update, and write YAML frontmatter
 * in markdown files (specifically DECISIONS.md files for CDD work items).
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Full markdown file content
 * @returns {Object} - { frontmatter: Object, body: string, raw: string }
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {},
      body: content,
      raw: '',
      hasFrontmatter: false
    };
  }

  const [, rawFrontmatter, body] = match;
  const frontmatter = parseYAML(rawFrontmatter);

  return {
    frontmatter,
    body,
    raw: rawFrontmatter,
    hasFrontmatter: true
  };
}

/**
 * Simple YAML parser for frontmatter
 * Handles basic key-value pairs, numbers, booleans, and quoted strings
 * @param {string} yamlString - Raw YAML content
 * @returns {Object} - Parsed object
 */
function parseYAML(yamlString) {
  const result = {};
  const lines = yamlString.split(/\r?\n/);
  let currentKey = null;
  let currentValue = [];
  let inMultiline = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      if (inMultiline && trimmed) {
        currentValue.push(line);
      }
      continue;
    }

    // Check if this is a key-value line
    const kvMatch = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    
    if (kvMatch) {
      // Save previous multiline value if any
      if (currentKey && inMultiline) {
        result[currentKey] = currentValue.join('\n');
        currentValue = [];
        inMultiline = false;
      }

      const [, indent, key, value] = kvMatch;
      currentKey = key.trim();
      
      // Handle nested objects (simple support)
      if (indent.length > 0 && value === '') {
        continue;
      }

      // Parse value
      if (value === '') {
        inMultiline = true;
      } else {
        result[currentKey] = parseValue(value);
        currentKey = null;
      }
    } else if (inMultiline) {
      currentValue.push(line);
    }
  }

  // Save final multiline value if any
  if (currentKey && inMultiline) {
    result[currentKey] = currentValue.join('\n');
  }

  return result;
}

/**
 * Parse a YAML value to appropriate JavaScript type
 * @param {string} value - Raw value string
 * @returns {*} - Parsed value (string, number, boolean, or array)
 */
function parseValue(value) {
  const trimmed = value.trim();

  // Boolean
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Null/undefined
  if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null;

  // Number
  if (/^-?\d+\.?\d*$/.test(trimmed)) {
    return trimmed.includes('.') ? parseFloat(trimmed) : parseInt(trimmed, 10);
  }

  // Quoted string
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  // Array (simple format: [item1, item2])
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map(v => parseValue(v.trim()));
  }

  // Default: return as string
  return trimmed;
}

/**
 * Convert object to YAML string
 * @param {Object} obj - Object to convert
 * @param {number} indent - Indentation level
 * @returns {string} - YAML string
 */
function toYAML(obj, indent = 0) {
  const lines = [];
  const spaces = ' '.repeat(indent);

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      lines.push(`${spaces}${key}:`);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      lines.push(`${spaces}${key}:`);
      lines.push(toYAML(value, indent + 2));
    } else if (Array.isArray(value)) {
      lines.push(`${spaces}${key}: [${value.join(', ')}]`);
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('#') || value.includes('\n'))) {
      lines.push(`${spaces}${key}: "${value}"`);
    } else {
      lines.push(`${spaces}${key}: ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Read and parse frontmatter from a file
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed frontmatter and content
 */
function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return parseFrontmatter(content);
}

/**
 * Update frontmatter in a file
 * @param {string} filePath - Path to markdown file
 * @param {Object} updates - Object with fields to update
 * @param {boolean} merge - If true, merge with existing; if false, replace
 */
function updateFrontmatter(filePath, updates, merge = true) {
  const { frontmatter, body, hasFrontmatter } = readFrontmatter(filePath);

  const newFrontmatter = merge ? { ...frontmatter, ...updates } : updates;
  const yamlContent = toYAML(newFrontmatter);
  const newContent = `---\n${yamlContent}\n---\n\n${body}`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return newFrontmatter;
}

/**
 * Get frontmatter from a file without reading the body
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Frontmatter object
 */
function getFrontmatter(filePath) {
  const { frontmatter } = readFrontmatter(filePath);
  return frontmatter;
}

/**
 * Find all DECISIONS.md files in a directory
 * @param {string} rootDir - Root directory to search
 * @returns {Array<string>} - Array of file paths
 */
function findDecisionsFiles(rootDir) {
  const results = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(fullPath);
        }
      } else if (entry.name === 'DECISIONS.md') {
        results.push(fullPath);
      }
    }
  }

  scan(rootDir);
  return results;
}

module.exports = {
  parseFrontmatter,
  parseYAML,
  toYAML,
  readFrontmatter,
  updateFrontmatter,
  getFrontmatter,
  findDecisionsFiles
};

// CLI support if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node frontmatter.js <file.md> [--get <key>] [--set <key> <value>]');
    process.exit(1);
  }

  const filePath = args[0];

  try {
    if (args[1] === '--get' && args[2]) {
      const fm = getFrontmatter(filePath);
      console.log(fm[args[2]]);
    } else if (args[1] === '--set' && args[2] && args[3]) {
      const updates = { [args[2]]: args[3] };
      updateFrontmatter(filePath, updates);
      console.log(`Updated ${args[2]} to ${args[3]}`);
    } else {
      const { frontmatter } = readFrontmatter(filePath);
      console.log(JSON.stringify(frontmatter, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

