import { useState } from 'react'
import Terminal from './Terminal'
import { Split, X } from 'lucide-react'

export default function SplitTerminal({ tabs, activeTab, fontSize, theme, tabStatuses, onStatusChange }) {
  const [splits, setSplits] = useState([{ id: 'main', tabId: activeTab }])
  const [orientation, setOrientation] = useState('horizontal')

  const addSplit = () => {
    const newId = 'split-' + Date.now()
    const availableTabs = tabs.filter(t => !splits.some(s => s.tabId === t.id))
    if (availableTabs.length === 0) {
      alert('No more tabs available for split')
      return
    }
    setSplits([...splits, { id: newId, tabId: availableTabs[0].id }])
  }

  const removeSplit = (splitId) => {
    if (splits.length === 1) return
    setSplits(splits.filter(s => s.id !== splitId))
  }

  return (
    <div className={`split-container ${orientation}`}>
      <div className="split-toolbar">
        <button onClick={() => setOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal')} title="Toggle orientation">
          <Split size={16} />
          <span>{orientation}</span>
        </button>
        <button onClick={addSplit} title="Add split" disabled={tabs.length <= splits.length}>
          + Split
        </button>
      </div>
      <div className="split-panes">
        {splits.map(split => {
          const tab = tabs.find(t => t.id === split.tabId)
          return (
            <div key={split.id} className="split-pane">
              {splits.length > 1 && (
                <div className="split-header">
                  <span>{tab?.name || 'Terminal'}</span>
                  <button className="close-split" onClick={() => removeSplit(split.id)}><X size={14} /></button>
                </div>
              )}
              <Terminal
                sessionId={tab?.id}
                cwd={tab?.cwd}
                fontSize={fontSize}
                theme={theme}
                onStatusChange={onStatusChange}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}