import axios from "axios";

const HandleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      errors: {
        formError: error.response?.data.message || ["Axios error occurred"],
      },
    };
  } else if (error instanceof Error) {
    return {
      errors: {
        formError: [error.message],
      },
    };
  } else {
    return {
      errors: {
        formError: ["Unknown error"],
      },
    };
  }
};

export default HandleError;
