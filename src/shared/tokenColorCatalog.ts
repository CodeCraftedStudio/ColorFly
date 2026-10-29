/**
 * ChromaForge: TextMate & Semantic Token Color Definitions
 */

export interface TokenCategoryDefinition {
  key: string;
  label: string;
  description: string;
  standardScopes: string[];
  defaultColorDark: string;
  defaultColorLight: string;
}

export const COMMON_TOKEN_CATEGORIES: TokenCategoryDefinition[] = [
  {
    key: 'comments',
    label: 'Comments',
    description: 'Single-line, multi-line, and docblock comments',
    standardScopes: ['comment', 'punctuation.definition.comment'],
    defaultColorDark: '#6a9955',
    defaultColorLight: '#008000',
  },
  {
    key: 'strings',
    label: 'Strings & Characters',
    description: 'String literals, interpolated strings, and escape sequences',
    standardScopes: ['string', 'string.quoted', 'punctuation.definition.string'],
    defaultColorDark: '#ce9178',
    defaultColorLight: '#a31515',
  },
  {
    key: 'numbers',
    label: 'Numbers & Units',
    description: 'Numeric literals, floats, integers, hex, and binary values',
    standardScopes: ['constant.numeric'],
    defaultColorDark: '#b5cea8',
    defaultColorLight: '#098658',
  },
  {
    key: 'keywords',
    label: 'Keywords & Control Flow',
    description: 'Language keywords like if, else, return, class, const, export',
    standardScopes: ['keyword', 'keyword.control'],
    defaultColorDark: '#569cd6',
    defaultColorLight: '#0000ff',
  },
  {
    key: 'functions',
    label: 'Functions & Methods',
    description: 'Function declarations, method invocations, and constructors',
    standardScopes: ['entity.name.function', 'support.function', 'meta.function-call'],
    defaultColorDark: '#dcdcaa',
    defaultColorLight: '#795e26',
  },
  {
    key: 'variables',
    label: 'Variables & Identifiers',
    description: 'Local variables, parameters, and variable references',
    standardScopes: ['variable', 'variable.other', 'variable.parameter'],
    defaultColorDark: '#9cdcfe',
    defaultColorLight: '#001080',
  },
  {
    key: 'types',
    label: 'Types & Interfaces',
    description: 'Type annotations, generic parameters, and interface declarations',
    standardScopes: ['entity.name.type', 'support.type'],
    defaultColorDark: '#4ec9b0',
    defaultColorLight: '#267f99',
  },
  {
    key: 'classes',
    label: 'Classes & Structs',
    description: 'Class definitions, inheritance clauses, and instantiations',
    standardScopes: ['entity.name.class', 'support.class'],
    defaultColorDark: '#4ec9b0',
    defaultColorLight: '#267f99',
  },
  {
    key: 'constants',
    label: 'Constants & Booleans',
    description: 'Named constants, boolean true/false, null, undefined',
    standardScopes: ['constant', 'constant.language'],
    defaultColorDark: '#4fc1ff',
    defaultColorLight: '#0070c1',
  },
  {
    key: 'operators',
    label: 'Operators',
    description: 'Arithmetic, logical, assignment, and comparison operators',
    standardScopes: ['keyword.operator'],
    defaultColorDark: '#d4d4d4',
    defaultColorLight: '#000000',
  },
  {
    key: 'punctuation',
    label: 'Punctuation & Delimiters',
    description: 'Parentheses, braces, brackets, semicolons, and commas',
    standardScopes: ['punctuation', 'punctuation.terminator', 'punctuation.separator'],
    defaultColorDark: '#d4d4d4',
    defaultColorLight: '#000000',
  },
  {
    key: 'regex',
    label: 'Regular Expressions',
    description: 'Regular expression patterns and character classes',
    standardScopes: ['string.regexp'],
    defaultColorDark: '#d16969',
    defaultColorLight: '#811f3f',
  },
];

export const STANDARD_SEMANTIC_TOKENS = [
  { id: 'variable', label: 'Variables', description: 'Local and global variables' },
  { id: 'variable.readonly', label: 'Read-only Variables (const)', description: 'Constant and immutable variable bindings' },
  { id: 'parameter', label: 'Parameters', description: 'Function and method arguments' },
  { id: 'function', label: 'Functions', description: 'Named and anonymous functions' },
  { id: 'method', label: 'Methods', description: 'Class and object member methods' },
  { id: 'class', label: 'Classes', description: 'Class declarations' },
  { id: 'interface', label: 'Interfaces', description: 'Interface declarations' },
  { id: 'type', label: 'Types', description: 'Type aliases and primitive types' },
  { id: 'enum', label: 'Enums', description: 'Enumeration declarations' },
  { id: 'enumMember', label: 'Enum Members', description: 'Individual enumeration values' },
  { id: 'property', label: 'Properties', description: 'Object and class properties' },
  { id: 'property.readonly', label: 'Read-only Properties', description: 'Immutable properties' },
  { id: 'namespace', label: 'Namespaces / Modules', description: 'Module and package names' },
];

