/**
 * ChromaForge: Syntax Highlighting Studio
 * Manages standard token categories, custom TextMate scope rules, and semantic token styling.
 */

import React, { useState, useEffect } from 'react';
import { COMMON_TOKEN_CATEGORIES, STANDARD_SEMANTIC_TOKENS } from '../../../shared/tokenColorCatalog';
import { TextMateTokenRule } from '../../../shared/types';
import { ColorInput } from '../common/ColorInput';
import { sendToExtension } from '../../vscodeApi';
import { PlusIcon, TrashIcon, SparklesIcon, CodeIcon } from '../common/Icons';

interface SyntaxHighlightingEditorProps {
  stagedTokenColors: Record<string, string>;
  stagedSemanticTokens: Record<string, any>;
  stagedTextMateRules?: TextMateTokenRule[];
}

export const SyntaxHighlightingEditor: React.FC<SyntaxHighlightingEditorProps> = ({
  stagedTokenColors = {},
  stagedSemanticTokens = {},
  stagedTextMateRules = [],
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'textmate' | 'semantic'>('categories');
  const [rules, setRules] = useState<TextMateTokenRule[]>(stagedTextMateRules);
  const [newScope, setNewScope] = useState('');
  const [newColor, setNewColor] = useState('#4ec9b0');
  const [newFontStyle, setNewFontStyle] = useState('');

  useEffect(() => {
    setRules((prev) =>
      JSON.stringify(prev) === JSON.stringify(stagedTextMateRules) ? prev : stagedTextMateRules
    );
  }, [stagedTextMateRules]);

  const tokens = stagedTokenColors || {};
  const semanticTokens = stagedSemanticTokens || {};

  const handleCategoryColorChange = (key: string, value: string) => {
    sendToExtension({
      type: 'STAGE_TOKEN_COLOR',
      payload: { key, value },
    });
  };

  const handleCategoryReset = (key: string) => {
    sendToExtension({
      type: 'STAGE_TOKEN_COLOR',
      payload: { key, value: '' },
    });
  };

  const handleAddTextMateRule = () => {
    if (!newScope.trim()) return;
    const rule: TextMateTokenRule = {
      name: `Custom Rule (${newScope.trim()})`,
      scope: newScope.trim(),
      settings: {
        foreground: newColor,
        fontStyle: newFontStyle,
      },
    };
    const updated = [...rules, rule];
    setRules(updated);
    sendToExtension({
      type: 'UPDATE_TEXTMATE_RULES',
      payload: { rules: updated },
    });
    setNewScope('');
  };

  const handleDeleteRule = (index: number) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
    sendToExtension({
      type: 'UPDATE_TEXTMATE_RULES',
      payload: { rules: updated },
    });
  };

  const handleSemanticColorChange = (selector: string, color: string) => {
    const updated = {
      ...stagedSemanticTokens,
      [selector]: color,
    };
    sendToExtension({
      type: 'UPDATE_SEMANTIC_TOKENS',
      payload: { tokens: updated },
    });
  };

  const handleApplySyntaxPreset = (presetColors: Record<string, string>) => {
    Object.entries(presetColors).forEach(([key, value]) => {
      sendToExtension({
        type: 'STAGE_TOKEN_COLOR',
        payload: { key, value },
      });
    });
  };

  const syntaxPresets = [
    {
      name: 'Default VS Code',
      colors: { keywords: '#569cd6', functions: '#dcdcaa', strings: '#ce9178', numbers: '#b5cea8', comments: '#6a9955', types: '#4ec9b0', variables: '#9cdcfe' },
    },
    {
      name: 'Monokai Pro',
      colors: { keywords: '#ff6188', functions: '#a9dc76', strings: '#ffd866', numbers: '#ab9df2', comments: '#727072', types: '#78dce8', variables: '#fcfcfa' },
    },
    {
      name: 'Tokyo Night',
      colors: { keywords: '#bb9af7', functions: '#7aa2f7', strings: '#9ece6a', numbers: '#ff9e64', comments: '#565f89', types: '#2ac3de', variables: '#c0caf5' },
    },
    {
      name: 'Cyberpunk Neon',
      colors: { keywords: '#ff007f', functions: '#00f0ff', strings: '#ffe600', numbers: '#a020f0', comments: '#00ff66', types: '#39ff14', variables: '#ffffff' },
    },
  ];

  const kwColor = tokens.keywords || '#569cd6';
  const fnColor = tokens.functions || '#dcdcaa';
  const strColor = tokens.strings || '#ce9178';
  const numColor = tokens.numbers || '#b5cea8';
  const commentColor = tokens.comments || '#6a9955';
  const typeColor = tokens.types || '#4ec9b0';
  const varColor = tokens.variables || '#9cdcfe';

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Sub Navigation */}
      <div className="card" style={{ padding: 8, display: 'flex', gap: 6 }}>
        <button
          className={`btn btn-sm ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('categories')}
        >
          Standard Token Categories
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'textmate' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('textmate')}
        >
          Advanced TextMate Scopes ({rules.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'semantic' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('semantic')}
        >
          Semantic Token Highlighting
        </button>
      </div>

      {/* 1. Standard Token Categories */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Syntax Preview Code Snippet */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)' }}>
                <CodeIcon size={14} />
                <span>Live Syntax Grammar Preview</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {syntaxPresets.map((sp) => (
                  <button
                    key={sp.name}
                    className="btn btn-outline btn-sm"
                    onClick={() => handleApplySyntaxPreset(sp.colors)}
                    title={`Apply ${sp.name} syntax colors`}
                  >
                    <SparklesIcon size={11} />
                    <span>{sp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'var(--cf-bg)',
                padding: '12px 16px',
                borderRadius: 6,
                border: '1px solid var(--cf-border)',
                fontFamily: 'var(--cf-font-mono)',
                fontSize: 12,
                lineHeight: '20px',
              }}
            >
              <div>
                <span style={{ color: kwColor }}>import</span> <span style={{ color: varColor }}>React</span> <span style={{ color: kwColor }}>from</span> <span style={{ color: strColor }}>'react'</span>;
              </div>
              <div>
                <span style={{ color: commentColor }}>// Real-time grammar token evaluator</span>
              </div>
              <div>
                <span style={{ color: kwColor }}>export async function</span> <span style={{ color: fnColor }}>calculatePalette</span>(<span style={{ color: varColor }}>seed</span>: <span style={{ color: typeColor }}>string</span>, <span style={{ color: varColor }}>steps</span> = <span style={{ color: numColor }}>5</span>): <span style={{ color: typeColor }}>Promise</span>&lt;<span style={{ color: typeColor }}>string</span>[]&gt; {'{'}
              </div>
              <div>
                &nbsp;&nbsp;<span style={{ color: kwColor }}>const</span> <span style={{ color: varColor }}>contrast</span>: <span style={{ color: typeColor }}>number</span> = <span style={{ color: numColor }}>4.5</span>;
              </div>
              <div>
                &nbsp;&nbsp;<span style={{ color: kwColor }}>return</span> [<span style={{ color: strColor }}>`#\${seed}_\${steps}`</span>];
              </div>
              <div>{'}'}</div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cf-border)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Standard Token Categories</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
                Core code grammar colors applied across all languages in the editor.
              </p>
            </div>

          <div>
            {COMMON_TOKEN_CATEGORIES.map((cat) => {
              const currentColor = tokens[cat.key] || cat.defaultColorDark;
              const isCustomized = tokens[cat.key] !== undefined;

              return (
                <div key={cat.key} className="color-row">
                  <div className="color-info">
                    <div className="color-title">
                      <span>{cat.label}</span>
                      {isCustomized && <span className="badge badge-warning" style={{ fontSize: 9 }}>Customized</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      {cat.description}
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      Scopes: {cat.standardScopes.join(', ')}
                    </div>
                  </div>

                  <div className="color-controls">
                    <ColorInput
                      colorId={cat.key}
                      value={currentColor}
                      defaultValue={cat.defaultColorDark}
                      isCustomized={isCustomized}
                      onChange={(val) => handleCategoryColorChange(cat.key, val)}
                      onReset={() => handleCategoryReset(cat.key)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      )}

      {/* 2. TextMate Rule Builder */}
      {activeTab === 'textmate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Add Rule Form */}
          <div className="card">
            <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Add Custom TextMate Scope Rule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  TextMate Scope (e.g. storage.type, entity.other.attribute-name)
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                  placeholder="variable.parameter.function"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Color
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--cf-desc-fg)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Font Style
                </label>
                <select
                  value={newFontStyle}
                  onChange={(e) => setNewFontStyle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--cf-input-bg)',
                    color: 'var(--cf-input-fg)',
                    border: '1px solid var(--cf-border)',
                    padding: '6px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  <option value="">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="bold">Bold</option>
                  <option value="underline">Underline</option>
                  <option value="strikethrough">Strikethrough</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={handleAddTextMateRule}>
                <PlusIcon size={12} />
                <span>Add Rule</span>
              </button>
            </div>
          </div>

          {/* Active Rules List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--cf-border)', fontWeight: 700, fontSize: 13, color: 'var(--cf-title-fg)' }}>
              Configured TextMate Rules ({rules.length})
            </div>
            {rules.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--cf-desc-fg)' }}>
                No custom TextMate rules defined yet. Add scopes above to target specific language syntax constructs.
              </div>
            ) : (
              rules.map((rule, idx) => (
                <div key={idx} className="color-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-title-fg)' }}>
                      {Array.isArray(rule.scope) ? rule.scope.join(', ') : rule.scope}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      Font Style: {rule.settings.fontStyle || 'Normal'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 4, background: rule.settings.foreground || '#fff', border: '1px solid var(--cf-border)' }} />
                    <span style={{ fontSize: 12, fontFamily: 'var(--cf-font-mono)', color: 'var(--cf-title-fg)' }}>{rule.settings.foreground}</span>
                    <button className="btn btn-outline btn-sm btn-danger" onClick={() => handleDeleteRule(idx)}>
                      <TrashIcon size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Semantic Token Customization */}
      {activeTab === 'semantic' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cf-border)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Semantic Token Color Customizations</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
              Target rich semantic tokens provided by Language Servers (TypeScript, Python, Rust, Go).
            </p>
          </div>

          <div>
            {STANDARD_SEMANTIC_TOKENS.map((token) => {
              const currentVal = semanticTokens[token.id] || '';
              return (
                <div key={token.id} className="color-row">
                  <div className="color-info">
                    <div className="color-title">{token.label}</div>
                    <div className="color-id">{token.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 2 }}>
                      {token.description}
                    </div>
                  </div>

                  <div className="color-controls">
                    <ColorInput
                      colorId={token.id}
                      value={currentVal || '#cccccc'}
                      defaultValue="#cccccc"
                      isCustomized={!!currentVal}
                      onChange={(val) => handleSemanticColorChange(token.id, val)}
                      onReset={() => handleSemanticColorChange(token.id, '')}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
