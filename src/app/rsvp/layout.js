

export default function DashboardLayout({ children }) {
  return (
    
      <div
        style={{
          '--page-bg': '#371f76', // override variable used in root layout
          backgroundColor: '#371f76',
          margin: 0,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </div>
   
  );
}