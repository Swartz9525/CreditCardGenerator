import React from "react";
import Signup from "./components/Authentication/Signup";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
