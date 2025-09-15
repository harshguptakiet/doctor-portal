
const UltraMinimal = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
          🎉 React App is Working!
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          This uses inline styles and no external dependencies.
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          If you can see this, React is rendering correctly.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => alert('Button works!')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Click
          </button>
        </div>
      </div>
    </div>
  );
};

export default UltraMinimal;
