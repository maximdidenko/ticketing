import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const mappedErrors = (
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(error => {
              return (
                <li key={error.message}>{error.message}</li>
              );
            })}
          </ul>
        </div>
      );
      setErrors(mappedErrors);
    }
  };

  return { errors, doRequest };
};

export default useRequest;
