'use client';
import cx from 'classnames';

interface TransferResponse {
  data: {
    status: string;
    message: string;
    errorMessage: string;
    isFieldError: boolean;
  };
}

interface ResponseMessageProps {
  response: TransferResponse['data'];
  handleClick: () => void;
}

const ResponseMessage: React.FC<ResponseMessageProps> = ({ response, handleClick }) => {
  const { status, message, errorMessage } = response;

  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center w-full h-30 p-4 rounded-md shadow-md',
        getMessageFromStatus(status)
      )}
    >
      <p className="text-lg font-bold">{message}</p>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        className={cx(getMessageFromStatus(status), 'w-full rounded-lg py-3 bg-opacity-40 hover:bg-opacity-90 font-bold mt-4')}
        onClick={handleClick}
      >
        Close
      </button>
    </div>
  );
};

const getMessageFromStatus = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-200 bg-opacity-50 border-green-400 border-2';
    case 'error':
      return 'bg-red-200 bg-opacity-50 border-red-400 border-2';
    default:
      return '';
  }
};

export default ResponseMessage;
