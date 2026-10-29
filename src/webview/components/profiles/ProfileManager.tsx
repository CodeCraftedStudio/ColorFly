/**
 * ChromaForge: Profile Management Studio
 * Create, duplicate, rename, delete, import, export, and compare theme profiles.
 */

import React, { useState, useMemo } from 'react';
import { ThemeProfile } from '../../../shared/types';
import { sendToExtension } from '../../vscodeApi';
import { StarIcon, PlusIcon, CloseIcon, CopyIcon, ExportIcon, TrashIcon, SearchIcon } from '../common/Icons';

interface ProfileManagerProps {
  profiles: ThemeProfile[];
  activeProfileId?: string;
  stagedColors: Record<string, string>;
  stagedTokenColors: Record<string, string>;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles = [],
  activeProfileId,
  stagedColors = {},
  stagedTokenColors = {},
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPreset, setFilterPreset] = useState<'all' | 'custom' | 'builtIn'>('all');

  const profileList = profiles || [];

  const filteredProfiles = useMemo(() => {
    return profileList.filter((p) => {
      if (filterPreset === 'custom' && p.isBuiltIn) return false;
      if (filterPreset === 'builtIn' && !p.isBuiltIn) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      }
      return true;
    });
  }, [profileList, filterPreset, searchQuery]);

  const handleApplyProfile = (id: string, applyImmediately: boolean) => {
    sendToExtension({
      type: 'LOAD_PROFILE',
      payload: { profileId: id, applyImmediately },
    });
  };

  const handleDuplicate = (id: string, name: string) => {
    const newName = prompt('Enter a name for the duplicated profile:', `${name} (Copy)`);
    if (newName && newName.trim()) {
      sendToExtension({
        type: 'DUPLICATE_PROFILE',
        payload: { profileId: id, newName: newName.trim() },
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete profile "${name}"?`)) {
      sendToExtension({
        type: 'DELETE_PROFILE',
        payload: { profileId: id },
      });
    }
  };

  const handleCreateFromDraft = () => {
    const name = prompt('Enter a name for this new profile:');
    if (!name || !name.trim()) return;

    const newProfile: ThemeProfile = {
      id: `profile-${Date.now()}`,
      version: 1,
      name: name.trim(),
      description: 'Custom profile created in ColorFly Studio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workbenchColors: { ...stagedColors },
      tokenColors: { ...stagedTokenColors },
    };

    sendToExtension({
      type: 'SAVE_PROFILE',
      payload: { profile: newProfile },
    });
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    sendToExtension({
      type: 'IMPORT_PROFILE',
      payload: { rawJson: importJsonText.trim() },
    });
    setImportJsonText('');
    setShowImportModal(false);
  };

  const handleExport = (id: string) => {
    sendToExtension({
      type: 'EXPORT_PROFILE',
      payload: { profileId: id, format: 'colorfly-profile' as any },
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Action Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700, color: 'var(--cf-title-fg)' }}>Theme Profiles & Starter Presets</h2>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cf-desc-fg)' }}>
            Save custom setups into reusable profiles, switch between starter presets, or import from JSON.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => setShowImportModal(true)}>
            <ExportIcon size={14} style={{ transform: 'rotate(180deg)' }} />
            <span>Import JSON</span>
          </button>
          <button className="btn btn-primary" onClick={handleCreateFromDraft}>
            <PlusIcon size={14} />
            <span>Save Current Draft as Profile</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', paddingLeft: 34 }}
            placeholder="Search profiles by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: 10, top: 10, color: 'var(--cf-desc-fg)', display: 'flex', alignItems: 'center' }}>
            <SearchIcon size={14} />
          </span>
          {searchQuery && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 8, top: 7, padding: '2px 6px' }}
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`btn btn-sm ${filterPreset === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterPreset('all')}
          >
            All ({profileList.length})
          </button>
          <button
            className={`btn btn-sm ${filterPreset === 'builtIn' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterPreset('builtIn')}
          >
            Presets ({profileList.filter((p) => p.isBuiltIn).length})
          </button>
          <button
            className={`btn btn-sm ${filterPreset === 'custom' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterPreset('custom')}
          >
            Custom ({profileList.filter((p) => !p.isBuiltIn).length})
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {filteredProfiles.map((p) => {
          const isActive = p.id === activeProfileId;
          const colorKeys = Object.keys(p.workbenchColors || {});

          return (
            <div
              key={p.id}
              className="card"
              style={{
                borderColor: isActive ? 'var(--cf-focus-border)' : 'var(--cf-border)',
                borderWidth: isActive ? 2 : 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cf-title-fg)' }}>{p.name}</span>
                    {isActive && <span className="badge badge-success" style={{ fontSize: 9 }}>Active</span>}
                    {p.isBuiltIn && <span className="badge badge-info" style={{ fontSize: 9 }}>Preset</span>}
                  </div>
                  {p.isFavorite && <StarIcon size={14} style={{ color: '#eab308' }} />}
                </div>

                <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)', marginTop: 6, lineHeight: 1.4 }}>
                  {p.description || 'No description provided.'}
                </div>

                <div style={{ fontSize: 11, color: 'var(--cf-desc-fg)', marginTop: 6 }}>
                  Includes <strong>{colorKeys.length}</strong> workbench color overrides
                </div>

                {/* Swatches strip */}
                <div style={{ display: 'flex', height: 18, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--cf-border)', marginTop: 10 }}>
                  {Object.values(p.workbenchColors || {}).slice(0, 6).map((val, idx) => (
                    <div key={idx} style={{ flex: 1, background: val }} title={val} />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--cf-border)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApplyProfile(p.id, false)}
                    title="Load into workspace as drafts"
                  >
                    Load Draft
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleApplyProfile(p.id, true)}
                    title="Directly apply this profile to VS Code interface"
                  >
                    Apply Now
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDuplicate(p.id, p.name)}
                    title="Duplicate Profile"
                  >
                    <CopyIcon size={12} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleExport(p.id)}
                    title="Export JSON"
                  >
                    <ExportIcon size={12} />
                  </button>
                  {!p.isBuiltIn && (
                    <button
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Delete Profile"
                    >
                      <TrashIcon size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 14, color: 'var(--cf-title-fg)' }}>Import Theme Profile (JSON)</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowImportModal(false)}>
                <CloseIcon size={12} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '0 0 10px 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>
                Paste ColorFly Profile JSON or a standard VS Code color-theme JSON object below:
              </p>
              <textarea
                style={{
                  width: '100%',
                  height: 200,
                  background: 'var(--cf-input-bg)',
                  color: 'var(--cf-input-fg)',
                  border: '1px solid var(--cf-border)',
                  borderRadius: 4,
                  padding: 10,
                  fontFamily: 'var(--cf-font-mono)',
                  fontSize: 12,
                }}
                placeholder='{ "name": "Custom Profile", "workbenchColors": { ... } }'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowImportModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleImportSubmit}>Import Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
