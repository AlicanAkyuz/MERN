import { TEST_DISPATCH } from "./types";

// register user
export const registeruser = userData => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};
