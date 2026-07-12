export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Example output:

// 483921
// 782134
// 921456
