export default function SignInPage() {
  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      justifyContent: "center", 
      alignItems: "center",
      flexDirection: "column",
      color: "white",
      background: "#111"
    }}>
      <h1>Sign in required</h1>
      <a 
        href="/api/auth/signin"
        style={{
          marginTop: "20px",
          padding: "12px 22px",
          background: "#4285F4",
          borderRadius: "6px",
          color: "#fff",
          textDecoration: "none",
          fontSize: "18px"
        }}
      >
        Continue with Google
      </a>
    </div>
  );
}