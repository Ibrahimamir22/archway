#!/usr/bin/env node

/**
 * Translation Checker for Archway Project
 * 
 * This script compares all translation files to identify missing translation keys.
 * It verifies that all keys present in the English (en.json) file are also present
 * in other language files like Arabic (ar.json).
 * 
 * Usage: 
 *   node scripts/check-translations.js
 *   
 * Options:
 *   --fix    Automatically add missing keys from English to other languages
 *            using the English value as placeholder
 *   --scan   Scan the codebase for used translation keys and check if they exist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');
const PRIMARY_LANGUAGE = 'en'; // The reference language with all keys
const LANGUAGES_TO_CHECK = ['ar']; // Add more languages as needed
const AUTO_FIX = process.argv.includes('--fix');
const SCAN_CODE = process.argv.includes('--scan');

// Helper to recursively get all keys from an object with their paths
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newPrefix)];
    } else {
      keys.push(newPrefix);
    }
  }
  return keys;
}

// Helper to set a nested key in an object
function setNestedKey(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

// Helper to get a nested value from an object
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[parts[i]];
  }
  
  return current;
}

// Function to scan codebase for translation keys
function scanCodebaseForTranslationKeys() {
  console.log('🔍 Scanning codebase for translation keys...');
  
  // Define regex patterns for different ways translation keys are used
  const patterns = [
    /t\(['"]([^'"]+)['"]\)/g,  // t('key')
    /t\[['"]([\w\d\.-_]+)['"]\]/g, // t['key'] or t["key"]
    /useTranslations\(['"]([^'"]+)['"]\)/g, // For namespace extraction
    /\{t\(['"]([\w\d\.-_]+)['"]\)\}/g, // {t('key')}
  ];
  
  const usedKeys = new Set();
  const usedNamespaces = new Set();
  
  // Helper to recursively process files in directory
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (/\.(tsx|jsx|ts|js)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract namespaces
        const namespaceMatches = content.match(/useTranslations\(['"]([^'"]+)['"]\)/g);
        if (namespaceMatches) {
          namespaceMatches.forEach(match => {
            const namespace = match.match(/useTranslations\(['"]([^'"]+)['"]\)/)[1];
            usedNamespaces.add(namespace);
          });
        }
        
        // Extract translation keys
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const key = match[1];
            if (key && !key.includes('${') && !key.includes('+')) { // Skip dynamic keys
              usedKeys.add(key);
            }
          }
        });
      }
    }
  }
  
  try {
    processDirectory(SRC_DIR);
    return { usedKeys: Array.from(usedKeys), usedNamespaces: Array.from(usedNamespaces) };
  } catch (err) {
    console.error('Error scanning codebase:', err);
    return { usedKeys: [], usedNamespaces: [] };
  }
}

// Main function to check translations
async function checkTranslations() {
  console.log('🔍 Checking translations...\n');
  
  // Load the primary language file
  const primaryLangPath = path.join(MESSAGES_DIR, `${PRIMARY_LANGUAGE}.json`);
  if (!fs.existsSync(primaryLangPath)) {
    console.error(`❌ Primary language file not found: ${primaryLangPath}`);
    process.exit(1);
  }
  
  let primaryLangData = JSON.parse(fs.readFileSync(primaryLangPath, 'utf8'));
  let primaryKeys = getAllKeys(primaryLangData);
  
  console.log(`📚 Found ${primaryKeys.length} keys in primary language (${PRIMARY_LANGUAGE})\n`);
  
  // First, check if any translation keys are used in code but missing from language files
  if (SCAN_CODE) {
    const { usedKeys, usedNamespaces } = scanCodebaseForTranslationKeys();
    console.log(`📝 Found ${usedKeys.length} translation keys used in components`);
    console.log(`📁 Used namespaces: ${usedNamespaces.join(', ')}`);
    
    // Find keys used in components but missing from primary language file
    const missingFromPrimary = [];
    
    for (const key of usedKeys) {
      let fullKey = key;
      
      // Handle namespaced keys if they don't contain a dot
      if (!key.includes('.')) {
        // Check if the key exists in any namespace
        let found = false;
        for (const namespace of usedNamespaces) {
          const namespacedKey = `${namespace}.${key}`;
          if (primaryKeys.includes(namespacedKey)) {
            found = true;
            break;
          }
        }
        
        if (!found) {
          // If the key doesn't exist in any namespace, add it to the list of missing keys
          missingFromPrimary.push(key);
        }
      } else if (!primaryKeys.includes(key)) {
        // For fully qualified keys (with namespace)
        missingFromPrimary.push(key);
      }
    }
    
    if (missingFromPrimary.length > 0) {
      console.log(`\n❓ Keys used in components but missing from all language files: ${missingFromPrimary.length}`);
      missingFromPrimary.forEach(key => {
        console.log(`  - ${key}`);
      });
      
      if (AUTO_FIX) {
        console.log(`\n🔧 Auto-fixing missing keys in ${PRIMARY_LANGUAGE}...`);
        let fixedPrimaryData = { ...primaryLangData };
        
        // Add all missing keys with placeholder values
        for (const key of missingFromPrimary) {
          const parts = key.split('.');
          if (parts.length > 1) {
            // For namespaced keys
            setNestedKey(fixedPrimaryData, key, `[Placeholder for ${key}]`);
          } else {
            // For non-namespaced keys, add to common namespace
            setNestedKey(fixedPrimaryData, `common.${key}`, `[Placeholder for ${key}]`);
          }
        }
        
        // Write the updated primary language file
        fs.writeFileSync(
          primaryLangPath,
          JSON.stringify(fixedPrimaryData, null, 2),
          'utf8'
        );
        
        console.log(`✅ Fixed ${missingFromPrimary.length} missing keys in ${PRIMARY_LANGUAGE}`);
        
        // Reload the primary language data and keys
        primaryLangData = JSON.parse(fs.readFileSync(primaryLangPath, 'utf8'));
        primaryKeys = getAllKeys(primaryLangData);
        console.log(`📚 Now have ${primaryKeys.length} keys in primary language (${PRIMARY_LANGUAGE})\n`);
      }
    } else {
      console.log(`✅ All translation keys used in components exist in the language files\n`);
    }
  }
  
  // Check each language
  for (const lang of LANGUAGES_TO_CHECK) {
    const langFilePath = path.join(MESSAGES_DIR, `${lang}.json`);
    if (!fs.existsSync(langFilePath)) {
      console.error(`❌ Language file not found: ${langFilePath}`);
      continue;
    }
    
    const langData = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
    const missingKeys = [];
    
    // Check for missing keys
    for (const key of primaryKeys) {
      const value = getNestedValue(langData, key);
      if (value === undefined) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      console.log(`❓ ${lang}: Missing ${missingKeys.length} keys`);
      
      // Print missing keys
      missingKeys.forEach(key => {
        const originalValue = getNestedValue(primaryLangData, key);
        console.log(`  - ${key}: "${originalValue}"`);
      });
      
      // Auto-fix if requested
      if (AUTO_FIX && missingKeys.length > 0) {
        console.log(`\n🔧 Auto-fixing missing keys in ${lang}...`);
        let fixedLangData = { ...langData };
        
        // Add all missing keys using the primary language value
        for (const key of missingKeys) {
          const value = getNestedValue(primaryLangData, key);
          setNestedKey(fixedLangData, key, value);
        }
        
        // Write the updated language file
        fs.writeFileSync(
          langFilePath,
          JSON.stringify(fixedLangData, null, 2),
          'utf8'
        );
        
        console.log(`✅ Fixed ${missingKeys.length} missing keys in ${lang}`);
      }
    } else {
      console.log(`✅ ${lang}: All keys are translated`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the checker
checkTranslations().catch(error => {
  console.error('Error checking translations:', error);
  process.exit(1);
}); 