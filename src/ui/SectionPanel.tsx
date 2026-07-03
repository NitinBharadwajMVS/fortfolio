import type { SectionId } from '../state/store'
import { sectionContent } from '../data/sections'
import type { Project, ExperienceItem } from '../data/sections'
import { useState, useEffect } from 'react'

interface SectionPanelProps {
  sectionId: SectionId
  onClose: () => void
}

export function SectionPanel({ sectionId, onClose }: SectionPanelProps) {
  const content = sectionContent[sectionId]
  const [isClosing, setIsClosing] = useState(false)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
  }

  if (sectionId === 'about') {
    return (
      <div 
        className="section-panel-backdrop" 
        onClick={handleClose} 
        role="presentation" 
        style={{ 
          zIndex: 9999, 
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          animation: isClosing ? 'backdropClose 200ms ease-out forwards' : 'backdropOpen 300ms ease-out forwards'
        }}
      >
        <style>{`
          .landmark-label, .hud, .minimap-widget, .toast-stack, .fallback-nav, .compass {
            display: none !important;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(142, 127, 101, 0.8);
            border-radius: 4px;
          }
          @keyframes profileOpen {
            0% { opacity: 0; transform: scale(0.92); }
            70% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes profileClose {
            0% { opacity: 1; transform: scale(1); }
            30% { opacity: 1; transform: scale(0.97); }
            100% { opacity: 0; transform: scale(0.92); }
          }
          @keyframes backdropOpen {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes backdropClose {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}</style>
        
        <div
          className="section-panel custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{ 
            width: 'min(90vw, 700px)',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(228, 213, 183, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '4px solid rgba(107, 92, 70, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(65, 53, 37, 0.8), 0 10px 30px rgba(0,0,0,0.25), inset 0 0 40px rgba(139,115,85,0.1)',
            color: '#2a2218',
            padding: 0,
            position: 'relative',
            animation: isClosing ? 'profileClose 200ms ease-out forwards' : 'profileOpen 300ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards'
          }}
        >
          {/* Header */}
          <div style={{ 
            background: 'rgba(108, 122, 74, 0.95)',
            padding: '1.25rem 1.5rem',
            borderBottom: '5px solid rgba(74, 84, 50, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.9rem', color: '#3d4725', letterSpacing: '2px', textShadow: '1px 1px 0 rgba(255,255,255,0.2)' }}>DROP ZONE</span>
              <h2 style={{ fontFamily: 'Bungee, cursive', fontSize: '2rem', margin: 0, color: '#f5ead2', textShadow: '2px 2px 0 #3d4725', letterSpacing: '1px', lineHeight: 1 }}>PLAYER PROFILE</h2>
            </div>
            
            <button type="button" onClick={handleClose} aria-label="Close" style={{
              background: 'rgba(65, 53, 37, 0.9)',
              border: '3px solid rgba(42, 34, 24, 0.9)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4c5a9',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 0 rgba(42, 34, 24, 0.9)'
            }}>✕</button>

            {/* Dog tag hanging from close button */}
            <div style={{ position: 'absolute', right: '30px', top: '45px', width: '45px', height: '70px', background: 'rgba(156, 164, 166, 0.95)', borderRadius: '8px', border: '2px solid rgba(90, 97, 99, 0.9)', transform: 'rotate(15deg)', zIndex: 10, boxShadow: 'inset 0 0 10px rgba(255,255,255,0.4), 4px 4px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px', backdropFilter: 'blur(2px)' }}>
              <div style={{ width: '8px', height: '8px', background: 'rgba(42, 34, 24, 0.9)', borderRadius: '50%', marginBottom: '8px' }}></div>
              <span style={{ fontFamily: 'Bungee, cursive', fontSize: '1.7rem', color: '#7a8185', textShadow: '-1px -1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(255,255,255,0.6)' }}>N</span>
              <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.55rem', color: '#5a6163', fontWeight: 'bold' }}>LVL 21</span>
            </div>
          </div>

          {/* Main Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Player Info */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontFamily: 'Bungee, cursive', fontSize: '2.5rem', lineHeight: '0.9', color: '#2a2218', margin: '0 0 1.25rem 0', textShadow: '2px 2px 0px rgba(255,255,255,0.6)' }}>NITIN<br/>BHARADWAJ</h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', borderTop: '2px solid rgba(107, 92, 70, 0.2)', borderBottom: '2px solid rgba(107, 92, 70, 0.2)', padding: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(132, 145, 98, 0.9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5ead2', fontSize: '1.1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>★</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#5d4f3b', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2a2218' }}>Builder</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(132, 145, 98, 0.9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5ead2', fontSize: '1.1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>◎</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#5d4f3b', textTransform: 'uppercase', letterSpacing: '1px' }}>Focus</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2a2218' }}>Machine Learning • Agentic AI</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(132, 145, 98, 0.9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5ead2', fontSize: '1.1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>⚑</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#5d4f3b', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Quest</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2a2218', fontStyle: 'italic', maxWidth: '200px' }}>Turning random "What if...?" ideas into real projects.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(93, 105, 65, 0.95)', padding: '0.3rem 0.8rem', transform: 'rotate(-1deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: 0, fontFamily: 'Bungee, cursive', fontSize: '1rem', color: '#f5ead2', letterSpacing: '1px', textShadow: '1px 1px 0 #3a4229' }}>ABOUT ME</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#31281d', fontWeight: 600 }}>
                  Behind every glowing beacon on this island is a project, and behind every project is someone who couldn't stop asking "What if...?"
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#31281d', fontWeight: 600 }}>
                  I enjoy building AI systems, interactive experiences and ideas that usually become much bigger than originally planned.
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#31281d', fontWeight: 600 }}>
                  Outside coding, you'll probably find me playing the piano, travelling, solving maths problems, or convincing myself one more game won't turn into five.
                </p>
              </div>
            </div>

            {/* Grid for Side Quests and Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              
              {/* Side Quests */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(93, 105, 65, 0.95)', padding: '0.3rem 0.8rem', transform: 'rotate(1deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Bungee, cursive', fontSize: '1rem', color: '#f5ead2', letterSpacing: '1px', textShadow: '1px 1px 0 #3a4229' }}>SIDE QUESTS</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['🎹 Piano', '🧠 Mathematics', '🎮 Gaming', '✈️ Travel', '☕ Late-night Debugging'].map(quest => {
                    const icon = quest.split(' ')[0];
                    const label = quest.substring(icon.length).trim();
                    return (
                      <div key={quest} style={{ background: 'rgba(209, 194, 163, 0.9)', border: '2px solid rgba(163, 149, 122, 0.9)', borderRadius: '4px', padding: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '75px', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>{icon}</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#4a3d2c', textTransform: 'uppercase', lineHeight: 1.1 }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(93, 105, 65, 0.95)', padding: '0.3rem 0.8rem', transform: 'rotate(-1.5deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Bungee, cursive', fontSize: '1rem', color: '#f5ead2', letterSpacing: '1px', textShadow: '1px 1px 0 #3a4229' }}>STATUS</h3>
                </div>
                <div style={{ background: 'rgba(209, 194, 163, 0.8)', border: '3px solid rgba(163, 149, 122, 0.8)', borderRadius: '6px', padding: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', flex: 1, minWidth: '60px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.3rem' }}>😀</span>
                    <span style={{ fontSize: '0.55rem', color: '#685942', textTransform: 'uppercase', fontWeight: 900 }}>Current Mood</span>
                    <span style={{ fontSize: '0.75rem', color: '#2a2218', fontWeight: 800, lineHeight: 1.2 }}>Building<br/>something.</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', flex: 1, minWidth: '60px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.3rem' }}>✨</span>
                    <span style={{ fontSize: '0.55rem', color: '#685942', textTransform: 'uppercase', fontWeight: 900 }}>XP</span>
                    <span style={{ fontSize: '0.75rem', color: '#9e4629', fontWeight: 800, lineHeight: 1.2 }}>Still<br/>grinding.</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', flex: 1, minWidth: '60px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.3rem' }}>🚀</span>
                    <span style={{ fontSize: '0.55rem', color: '#685942', textTransform: 'uppercase', fontWeight: 900 }}>Mission Status</span>
                    <span style={{ fontSize: '0.85rem', color: '#4d6945', fontWeight: 800, marginTop: '2px' }}>In Progress</span>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Objective Complete */}
            <div style={{ background: 'rgba(85, 97, 62, 0.95)', border: '3px solid rgba(60, 69, 44, 0.9)', borderRadius: '6px', padding: '1rem 1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center', marginTop: '0.25rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.2)' }}>
              <div style={{ width: '40px', height: '40px', background: 'transparent', border: '3px solid #f5ead2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <span style={{ color: '#f5ead2', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <h4 style={{ margin: 0, fontFamily: 'Bungee, cursive', fontSize: '1.1rem', color: '#f5ead2', textShadow: '1px 1px 0 #2b331d', letterSpacing: '1px' }}>OBJECTIVE COMPLETE</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#d5dfc3', fontWeight: 700 }}>Enough about me.<br/>← Head left to Mission Archive.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  if (sectionId === 'projects') {
    const projects = content.items as Project[];
    const selectedProject = projects[selectedProjectIndex];

    return (
      <div 
        className="section-panel-backdrop" 
        onClick={handleClose} 
        role="presentation" 
        style={{ 
          zIndex: 9999, 
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          animation: isClosing ? 'backdropClose 200ms ease-out forwards' : 'backdropOpen 300ms ease-out forwards'
        }}
      >
        <style>{`
          .landmark-label, .hud, .minimap-widget, .toast-stack, .fallback-nav, .compass {
            display: none !important;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(142, 127, 101, 0.8);
            border-radius: 4px;
          }
          .mission-item:hover {
            background: rgba(108, 122, 74, 0.15) !important;
            border-left: 4px solid rgba(108, 122, 74, 0.8) !important;
          }
          .mission-item.selected {
            background: rgba(108, 122, 74, 0.25) !important;
            border-left: 4px solid rgba(108, 122, 74, 1) !important;
          }
          @keyframes terminalOpen {
            0% { opacity: 0; transform: scale(0.92); }
            70% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes terminalClose {
            0% { opacity: 1; transform: scale(1); }
            30% { opacity: 1; transform: scale(0.97); }
            100% { opacity: 0; transform: scale(0.92); }
          }
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes backdropOpen {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes backdropClose {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}</style>
        
        <div
          className="section-panel custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{ 
            width: 'min(95vw, 950px)',
            maxHeight: '85vh',
            background: 'rgba(228, 213, 183, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '4px solid rgba(65, 53, 37, 0.9)',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(42, 34, 24, 0.8), 0 10px 30px rgba(0,0,0,0.25), inset 0 0 40px rgba(139,115,85,0.1)',
            color: '#2a2218',
            padding: 0,
            position: 'relative',
            animation: isClosing ? 'terminalClose 200ms ease-out forwards' : 'terminalOpen 300ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ 
            background: 'rgba(65, 53, 37, 0.95)',
            padding: '1.25rem 1.5rem',
            borderBottom: '5px solid rgba(42, 34, 24, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#e74c3c', borderRadius: '50%', boxShadow: '0 0 10px #e74c3c' }}></div>
              <h2 style={{ fontFamily: 'Bungee, cursive', fontSize: '1.6rem', margin: 0, color: '#f5ead2', letterSpacing: '2px', textShadow: '1px 1px 0 #000' }}>MISSION ARCHIVE</h2>
            </div>
            
            <button type="button" onClick={handleClose} aria-label="Close" style={{
              background: 'transparent',
              border: '2px solid rgba(245, 234, 210, 0.5)',
              borderRadius: '4px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5ead2',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}>✕</button>
          </div>

          {/* Split Layout Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* Left Panel: Mission Brief */}
            <div style={{ 
              flex: '1.5', 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              borderRight: '3px solid rgba(163, 149, 122, 0.5)',
              overflowY: 'auto'
            }} className="custom-scrollbar">
              
              <div style={{ 
                opacity: isFading ? 0 : 1, 
                transition: 'opacity 200ms ease',
                animation: !isFading ? 'fadeSlideIn 300ms ease-out forwards' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.8rem', color: '#685942', letterSpacing: '2px' }}>MISSION BRIEFING</span>
                  <h1 style={{ fontFamily: 'Bungee, cursive', fontSize: '2.5rem', lineHeight: '1', color: '#2a2218', margin: 0, textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>
                    {selectedProject?.title}
                  </h1>
                </div>

                <div style={{ background: 'rgba(93, 105, 65, 0.1)', border: '2px solid rgba(93, 105, 65, 0.3)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, color: '#31281d', fontWeight: 600 }}>
                    {selectedProject?.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  {/* Loadout (Tech Stack) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                      <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.9rem', color: '#4a3d2c', letterSpacing: '1px' }}>LOADOUT</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedProject?.tags.map(tag => (
                        <span key={tag} style={{ background: 'rgba(163, 149, 122, 0.4)', border: '1px solid rgba(163, 149, 122, 0.8)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#2a2218', textTransform: 'uppercase' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>📡</span>
                      <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.9rem', color: '#4a3d2c', letterSpacing: '1px' }}>STATUS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#27ae60', borderRadius: '50%', boxShadow: '0 0 5px #27ae60' }}></span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2a2218', textTransform: 'uppercase' }}>Completed</span>
                    </div>
                    
                    {selectedProject?.link ? (
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          marginTop: '0.5rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#5d6941',
                          color: '#f5ead2',
                          padding: '0.6rem 1rem',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          fontFamily: 'Bungee, cursive',
                          fontSize: '0.85rem',
                          letterSpacing: '1px',
                          border: '2px solid #3c452c',
                          boxShadow: '0 4px 0 #3c452c',
                          alignSelf: 'flex-start',
                          transition: 'transform 0.1s, box-shadow 0.1s'
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'translateY(4px)';
                          e.currentTarget.style.boxShadow = '0 0 0 #3c452c';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 0 #3c452c';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 0 #3c452c';
                        }}
                      >
                        OPEN REPOSITORY ↗
                      </a>
                    ) : (
                      <button 
                        disabled
                        style={{ 
                          marginTop: '0.5rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(93, 105, 65, 0.5)',
                          color: 'rgba(245, 234, 210, 0.5)',
                          padding: '0.6rem 1rem',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontFamily: 'Bungee, cursive',
                          fontSize: '0.85rem',
                          letterSpacing: '1px',
                          border: '2px solid rgba(60, 69, 44, 0.5)',
                          boxShadow: '0 4px 0 rgba(60, 69, 44, 0.5)',
                          alignSelf: 'flex-start',
                          cursor: 'not-allowed'
                        }}
                      >
                        REPOSITORY COMING SOON
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Mission List */}
            <div style={{ 
              flex: '1', 
              background: 'rgba(209, 194, 163, 0.4)', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              overflowY: 'auto'
            }} className="custom-scrollbar">
              <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.9rem', color: '#685942', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>ACTIVE MISSIONS</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {projects.map((proj, idx) => (
                  <button
                    key={proj.title}
                    className={`mission-item ${idx === selectedProjectIndex ? 'selected' : ''}`}
                    onClick={() => {
                      if (idx !== selectedProjectIndex) {
                        setIsFading(true)
                        setTimeout(() => {
                          setSelectedProjectIndex(idx)
                          setIsFading(false)
                        }, 200)
                      }
                    }}
                    style={{
                      background: 'rgba(163, 149, 122, 0.2)',
                      border: 'none',
                      borderLeft: '4px solid transparent',
                      borderBottom: '1px solid rgba(163, 149, 122, 0.3)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      borderRadius: '0 4px 4px 0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'Bungee, cursive', fontSize: '0.75rem', color: idx === selectedProjectIndex ? '#5d6941' : '#8e7f65' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ 
                        fontFamily: 'Bungee, cursive', 
                        fontSize: '0.95rem', 
                        color: '#2a2218',
                        letterSpacing: '0.5px'
                      }}>
                        {proj.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-panel-backdrop" onClick={onClose} role="presentation">
      <div
        className="section-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="section-panel-title"
      >
        <button type="button" className="section-panel__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <p className="section-panel__subtitle">{content.subtitle}</p>
        <h2 id="section-panel-title" className="section-panel__title">
          {content.title}
        </h2>
        <p className="section-panel__body">{content.body}</p>

        {content.items && (
          <div className="section-panel__items">
            {sectionId === 'projects' &&
              (content.items as Project[]).map((project) => (
                <article key={project.title} className="section-panel__card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="section-panel__tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer">
                      View project →
                    </a>
                  )}
                </article>
              ))}

            {sectionId === 'experience' &&
              (content.items as ExperienceItem[]).map((exp) => (
                <article key={exp.role} className="section-panel__card">
                  <h3>{exp.role}</h3>
                  <p className="section-panel__meta">
                    {exp.company} · {exp.period}
                  </p>
                  <p>{exp.description}</p>
                </article>
              ))}

            {(sectionId === 'about' || sectionId === 'skills' || sectionId === 'contact') &&
              (content.items as string[]).map((item) => (
                <div key={item} className="section-panel__list-item">
                  {sectionId === 'contact' ? (
                    <a href={item.includes('@') ? `mailto:${item}` : `https://${item}`}>{item}</a>
                  ) : (
                    item
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
