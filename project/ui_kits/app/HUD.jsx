// HUD glass panel — controls + live metrics.
// Matches #hud in the source: bottom-left, 10px inset, 1px #1f2b58 border,
// rgba(0,0,0,0.45) fill, #25315f rule above metrics.
function HUD() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      left: 10,
      maxWidth: 460,
      fontSize: 12,
      lineHeight: 1.35,
      background: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid #1f2b58',
      borderRadius: 8,
      padding: 10,
      color: '#d5dcff',
      fontFamily: 'var(--font-sans)',
      backdropFilter: 'blur(2px)'
    }}>
      <strong>Controles</strong><br/>
      Arrastra la <InlineCode>esfera</InlineCode> con el ratón.<br/>
      Mueve el <InlineCode>cubo</InlineCode> con <InlineCode>W A S D</InlineCode> (plano XZ) y <InlineCode>Q/E</InlineCode> (Y).<br/>
      Rota el cubo con <InlineCode>I J K L U O</InlineCode>.<br/>
      Ejecución activa de fases: interacción + backend geométrico en worker.
      <div style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid #25315f',
        color: '#7dff7f'
      }}>
        Intersección: <strong>sí</strong><br/>
        Backend: <strong>worker</strong><br/>
        Samples: <strong>20</strong><br/>
        Volumen aprox.: <strong>0.4823</strong><br/>
        Área aprox.: <strong>4.7120</strong><br/>
        Δx=0.930 · Δy=0.860 · Δz=1.210<br/>
        <span style={{ color:'#9fb0ff' }}>F1=done · F2=running · F3=running · F4=running · F5=started</span>
      </div>
      <div style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid #25315f',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: 11
      }}>
        <label style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          Backend:
          <select defaultValue="worker" style={{ fontFamily:'var(--font-mono)', fontSize:11, background:'#0b0f22', color:'#c6d2ff', border:'1px solid #1f2b58', borderRadius:4, padding:'2px 4px' }}>
            <option value="worker">worker</option>
            <option value="inline">inline</option>
          </select>
        </label>
        <label style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          Samples:
          <input type="number" defaultValue={20} style={{ width:56, fontFamily:'var(--font-mono)', fontSize:11, background:'#0b0f22', color:'#c6d2ff', border:'1px solid #1f2b58', borderRadius:4, padding:'2px 4px' }}/>
        </label>
        <button style={{ fontFamily:'Inter, sans-serif', fontSize:11, background:'#0b0f22', color:'#d5dcff', border:'1px solid #263260', borderRadius:5, padding:'3px 10px', cursor:'pointer' }}>Aplicar</button>
      </div>
      <div style={{ marginTop:6, color:'#9fb0ff', fontSize:11 }}>
        Perf: <span style={{ fontFamily:'var(--font-mono)', color:'#7dff7f' }}>worker · 20³ · 3.4 ms</span>
      </div>
    </div>
  );
}

Object.assign(window, { HUD });
