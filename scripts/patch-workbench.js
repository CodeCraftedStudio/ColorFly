const fs = require('fs');
let content = fs.readFileSync('src/webview/components/workbench/WorkbenchColorCatalog.tsx', 'utf8');

// Use CRLF line endings to match file
const crlf = '\r\n';

// Add bulk action bar after Results Header Status section
const oldText1 = `      {/* Results Header Status */}${crlf}      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flexWrap: 'wrap', gap: 8 }}}>${crlf}        <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>${crlf}          {selectedCategory !== 'all'${crlf}            ? t('wcat.showingIn', {${crlf}                n: filteredColors.length,${crlf}                cat: WORKBENCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label || '',${crlf}              })${crlf}            : t('wcat.showing', { n: filteredColors.length })}`;

// Match up to the closing </div> of the results header section
const oldText1b = `          {copyStatus && (\r\n            <span style={{ color: '#16a34a', marginLeft: 10, fontWeight: 600 }}>✓ {copyStatus}</span>${crlf}          )}${crlf}        </div>${crlf}      </div>`;

const newText1 = `      {/* Results Header Status */}${crlf}      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flexWrap: 'wrap', gap: 8 }}}>${crlf}        <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>${crlf}          {selectedCategory !== 'all'${crlf}            ? t('wcat.showingIn', {${crlf}                n: filteredColors.length,${crlf}                cat: WORKBENCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label || '',${crlf}              })${crlf}            : t('wcat.showing', { n: filteredColors.length })}`;

const newText1b = `          {copyStatus && (\r\n            <span style={{ color: '#16a34a', marginLeft: 10, fontWeight: 600 }}>✓ {copyStatus}</span>${crlf}          )}${crlf}        </div>${crlf}      </div>${crlf}`;

const bulkBar = `
      {/* Bulk Action Bar */}
      {bulkSelected.size > 0 && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid var(--cf-accent)',
            borderRadius: 8,
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--cf-desc-fg)' }}>
            {bulkSelected.size} {t('wcat.selectedCount')}
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkActivate}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-accent)', color: 'var(--cf-accent)' }}
          >
            {t('wcat.bulkActivate')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkDeactivate}
            style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--cf-border)', color: 'var(--cf-title-fg)' }}
          >
            {t('wcat.bulkDeactivate')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleBulkReset}
            style={{ padding: '4px 10px', fontSize: 11, color: '#ef4444', borderColor: '#ef4444' }}
          >
            {t('wcat.bulkReset')}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setBulkSelected(new Set())}
            style={{ padding: '4px 10px', fontSize: 11, marginLeft: 'auto' }}
          >
            {t('wcat.clearSelection')}
          </button>
        </div>
      )}`;

if (content.includes(oldText1b)) {
  content = content.replace(oldText1b, newText1b + bulkBar);
  console.log('Bulk action bar added');
} else {
  console.log('Results Header Status block not found');
}

// Add contrast badge
const oldContrast = `                    {!isActive && isCustomized && <span className="badge badge-info" style={{ fontSize: 9 }}>{t('wcat.inactiveBadge')}</span>}${crlf}                    {isStaged && <span className="badge badge-warning" style={{ fontSize: 9 }}>{t('wcat.draftBadge')}</span>}${crlf}                    {isCustomized && !isStaged && isActive && <span className="badge badge-success" style={{ fontSize: 9 }}>{t('wcat.activeOverrideBadge')}</span>}`;
const newContrast = `                    {!isActive && isCustomized && <span className="badge badge-info" style={{ fontSize: 9 }}>{t('wcat.inactiveBadge')}</span>}${crlf}                    {isStaged && <span className="badge badge-warning" style={{ fontSize: 9 }}>{t('wcat.draftBadge')}</span>}${crlf}                    {isCustomized && !isStaged && isActive && <span className="badge badge-success" style={{ fontSize: 9 }}>{t('wcat.activeOverrideBadge')}</span>}${crlf}                    {currentColor && currentColor !== colorDef.defaultValue && (${crlf}                      <span className="badge badge-info" style={{ fontSize: 8, marginLeft: 6 }}>${crlf}                        {getContrastBadge(currentColor)?.ratio + ':1 ' + getContrastBadge(currentColor)?.level.toUpperCase()}${crlf}                      </span>${crlf}                    )}`;

if (content.includes(oldContrast)) {
  content = content.replace(oldContrast, newContrast);
  console.log('Contrast badge added');
} else {
  console.log('Contrast area not found');
}

fs.writeFileSync('src/webview/components/workbench/WorkbenchColorCatalog.tsx', content);
console.log('Done');